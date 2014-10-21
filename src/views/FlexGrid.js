define(function(require, exports, module) {
    var View = require('famous/core/View');

    function FlexGrid() {
        View.apply(this, arguments);

    }

    FlexGrid.prototype = Object.create(View.prototype);
    FlexGrid.prototype.constructor = FlexGrid;

    FlexGrid.DEFAULT_OPTIONS = {};

    FlexGrid.prototype.sequenceFrom = function() {

    };

    module.exports = FlexGrid;
});
