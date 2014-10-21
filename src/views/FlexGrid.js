define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Entity = require('famous/core/Entity');
    var Transform = require('famous/core/Transform');

    function FlexGrid() {
        View.apply(this, arguments);

        this.id = Entity.register(this);
    }

    FlexGrid.prototype = Object.create(View.prototype);
    FlexGrid.prototype.constructor = FlexGrid;

    FlexGrid.DEFAULT_OPTIONS = {
        marginTop: undefined,
        marginLeft: undefined,
        gutterCol: undefined,
        gutterRow: undefined,
        itemSize: undefined
    };

    FlexGrid.prototype.sequenceFrom = function(items) {
        this._items = items;
    };

    FlexGrid.prototype.render = function() {
        return this.id;
    };

    FlexGrid.prototype.commit = function(context) {
        var width = context.size[0];

        var specs = [];

        for (var i = 0; i < this._items.length; i++) {
            var spec = {
                target: this._items[i].render(),
                size: this.options.itemSize,
                transform: Transform.translate(0, i * 150, 0)
            }

            specs.push(spec);
        }

        return specs;
    };

    module.exports = FlexGrid;
});
