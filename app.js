require([
    'esri/map',
    'esri/layers/MapImage',
    'esri/layers/MapImageLayer',
    'esri/geometry/Extent',
    'dijit/Dialog',
    'dojo/dom-construct'
], function (Map, MapImage, MapImageLayer, Extent, Dialog, domConstruct) {
    'use strict';

    var offset = (-3 + new Date().getDay()) * 0.005;

    var extent = new Extent({
        'type': 'extent',
        'xmin': -93.29479007360592 + offset,
        'ymin': 44.28555756682327 + offset,
        'xmax': -93.29476123985901 + offset,
        'ymax': 44.28557436778021 + offset,
        'spatialReference': {
            'wkid': 4326
        }
    });
    var map = new Map('map', {
        basemap: 'topo',
        center: [-93.295, 44.286],
        zoom: 13
    });

    var layer = new MapImageLayer({
        'id': 'cat'
    });

    var img = new MapImage({
        href: 'http://www.zakshow.com/show/cat2.jpg',
        extent: extent,
        isReference: true
    });

    layer.addImage(img);
    map.addLayer(layer);

    var signal = map.on('click', function (event) {
        if (extent.intersects(event.mapPoint)) {
            new Dialog({
                title: 'Meow!',
                content: 'You found me...good luck tomorrow!'
            }, domConstruct.create('div')).show();
            layer.removeAllImages();
            signal.remove();
        }
    });

});
