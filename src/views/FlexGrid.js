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
        marginSide: undefined,
        gutterCol: undefined,
        gutterRow: undefined,
        itemSize: undefined
    };

    function _calcSpacing(width) {
        var itemWidth = this.options.itemSize[0];
        var gutterCol = this.options.gutterCol;
        var ySpacing = itemWidth + gutterCol;
        var margin = this.options.marginSide;
        var numCols = Math.floor((width - 2 * margin + gutterCol) / ySpacing);
        margin = (width - numCols * ySpacing + gutterCol)/2;
        return {
            numCols: numCols,
            marginSide: margin,
            ySpacing: ySpacing
        }
    }

    function _calcPositions(spacing) {
        var positions = [];

        var col = 0;
        var row = 0;
        var xPos;
        var yPos;

        for (var i = 0; i < this._items.length; i++) {
            xPos = spacing.marginSide + col * spacing.ySpacing;
            yPos = this.options.marginTop + row * (this.options.itemSize[1] + this.options.gutterRow);
            positions.push({
                xPos: xPos,
                yPos: yPos
            });

            col++
            if (col === spacing.numCols) {
                row++;
                col = 0;
            }
        }

        return positions;
    }

    FlexGrid.prototype.sequenceFrom = function(items) {
        this._items = items;
    };

    FlexGrid.prototype.render = function() {
        return this.id;
    };

    FlexGrid.prototype.commit = function(context) {
        var width = context.size[0];

        var specs = [];

        if (this._cachedWidth !== width) {
            var spacing = _calcSpacing.call(this, width);
            var positions = _calcPositions.call(this, spacing);

            for (var i = 0; i < this._items.length; i++) {
                var spec = {
                    target: this._items[i].render(),
                    size: this.options.itemSize,
                    transform: Transform.translate(positions[i].xPos, positions[i].yPos, 0)
                }

                specs.push(spec);
            }

            this._cachedWidth = width;
            this._cachedSpecs = specs;
        }

        return this._cachedSpecs;
    };

    module.exports = FlexGrid;
});
