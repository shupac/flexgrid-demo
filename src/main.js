define(function(require, exports, module) {
    'use strict';

    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Scrollview = require('famous/views/Scrollview');
    var FlexGrid = require('views/FlexGrid');

    var NUM_SURFACES = 24;

    var mainContext = Engine.createContext();

    var scrollview = new Scrollview();
    mainContext.add(scrollview);
    Engine.pipe(scrollview);

    var flexGrid = new FlexGrid({
        marginTop: 50,
        marginSide: 50,
        gutterCol: 40,
        gutterRow: 20,
        itemSize: [150, 100]
    });

    scrollview.sequenceFrom([flexGrid]);

    var surfaces = [];

    for (var i = 0; i < NUM_SURFACES; i++) {
        var surface = new Surface({
            properties: {
                backgroundColor: 'hsl(' + (i * 360 / NUM_SURFACES) + ', 100%, 50%)'
            }
        });
        surfaces.push(surface);
    }

    flexGrid.sequenceFrom(surfaces);
});
