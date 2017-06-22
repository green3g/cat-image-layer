define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'esri/layers/MapImage',
    'esri/layers/MapImageLayer',
    'esri/geometry/Extent',
    './img/cat.js'
], function (declare, lang, on, MapImage, MapImageLayer, Extent, catUrl) {

    function getStoredExtent (key) {
        return new Extent(JSON.parse(localStorage[key]));
    }

    function storeExtent (extent, key) {
        localStorage.setItem(key, JSON.stringify(extent.toJson()));
    }

    return declare([MapImageLayer], {
        url: catUrl,
        storeKey: 'cat_location',
        x: 0,
        y: 0,
        xScale: 1,
        yScale: 1.5,
        wkid: 3857,
        constructor: function () {
            this.inherited(arguments);
            this.store = Boolean(window.localStorage);
        },
        onLoad: function () {
            if (this.extent) {
                this.placeCat();
            } else if (this.store) {
                this.extent = this.getStoredExtent(this.storeKey);
                this.placeCat();
            } else {
                this.setNewExtent();
            }

        },
        placeCat: function () {
            this.reset();
            this.image = new MapImage({
                url: this.url,
                extent: this.extent
            });
            this.addImage(this.image);
            this.listener = on(this.image._node, 'click', lang.hitch(this, 'setNewExtent'));
        },
        reset: function () {
            this.removeAllImages();
            if (this.listener) {
                this.listener.remove();
                this.listener = null;
            }
        },
        setNewExtent: function () {
            this.extent = new Extent({
                xmin: this.x,
                ymin: this.y,
                xmax: (this.x + 1) * this.xScale,
                ymax: (this.y + 1) * this.yScale,
                spatialReference: {
                    wkid: this.wkid
                }
            });
            this.placeCat();
        }
    });

});
