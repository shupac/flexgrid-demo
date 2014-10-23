define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Entity = require('famous/core/Entity');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');
    var Easing = require('famous/transitions/Easing');

    function FlexGrid() {
        View.apply(this, arguments);

        this._modifiers = [];
        this._states = [];

        this.id = Entity.register(this);
    }

    FlexGrid.prototype = Object.create(View.prototype);
    FlexGrid.prototype.constructor = FlexGrid;

    var initialTime = Date.now();

    FlexGrid.DEFAULT_OPTIONS = {
        marginTop: undefined,
        marginSide: undefined,
        gutterCol: undefined,
        gutterRow: undefined,
        itemSize: undefined,
        transition: { curve: Easing.outBack, duration: 500 },
        center: undefined
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

    function _calcCenterLayout() {
        var layout = {
            positions: [null],
            rotations: [],
            center: true
        };

        var angle;

        for (var i = 0; i < this._items.length; i++) {
            angle = (2 * Math.PI / this._items.length);
            layout.rotations.push([0, 0, angle]);
            layout.positions.push([0, 0, 0]);
        }

        return layout;
    }

    function _calcGridLayout(spacing) {
        var layout = {
            positions: [],
            rotations: [null],
            center: false
        };

        var col = 0;
        var row = 0;
        var xPos;
        var yPos;

        for (var i = 0; i < this._items.length; i++) {
            xPos = spacing.marginSide + col * spacing.ySpacing;
            yPos = this.options.marginTop + row * (this.options.itemSize[1] + this.options.gutterRow);
            layout.positions.push([xPos, yPos, 0]);
            console.log([xPos, yPos, 0]);

            col++
            if (col === spacing.numCols) {
                row++;
                col = 0;
            }
        }

        return layout;
    }

    function _createModifier(index, layout, size) {

        var state = {
            transform: new TransitionableTransform,
            size: new Transitionable(size || this.options.itemSize),
            origin: new Transitionable([layout.origin]),
            align: new Transitionable([layout.align])
        }

        state.transform.setTranslate(layout.positions[index]);
        console.log(state.transform);
        // if (layout.center === false) {
        //     state.transform.setRotate([0, 0, (layout.rotations[index]) + .002 * (Date.now() - initialTime)]);
        // }

        // if (layout.rotations !== undefined) {
        //     state.transform.setRotate([0, 0, (layout.rotations[index]) + .002 * (Date.now() - initialTime)]);
        // } else {
        //     state.transform.setRotate([0,0,0]);
        // }

        var modifier = new Modifier(state);

        this._states[index] = state;
        this._modifiers[index] = modifier;
    }

    function _animateModifier(index, layout, size) {

        var transformTransitionable = this._states[index].transform;
        var sizeTransitionable = this._states[index].size;
        var originTransitionable = this._states[index].origin;
        var alignTransitionable = this._states[index].align;

        transformTransitionable.halt();
        sizeTransitionable.halt();
        originTransitionable.halt();
        alignTransitionable.halt();

        transformTransitionable.set(layout.transform, this.options.transition);
        sizeTransitionable.set(size, this.options.transition);
        originTransitionable.set(layout.origin, this.options.transition);
        alignTransitionable.set(layout.align, this.options.align);
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
            var size = this.options.itemSize;
            if (spacing.numCols < 2) {
                spacing.numCols = 1;
                spacing.marginSide = 0;
                size = [width, size[1]];
            }

            var layout;

            if (this.options.center === undefined || this.options.center === false) {
                layout = _calcGridLayout.call(this, spacing);
            } else if (this.options.center === true) {
                layout = _calcCenterLayout.call(this,spacing);
            }

            console.log(layout);

            for (var i = 0; i < this._items.length; i++) {
                if (this._modifiers[i] === undefined) {
                    _createModifier.call(this, i, layout, size);
                }
                else {
                    _animateModifier.call(this, i, layout, size);
                }
            }

            this._cachedWidth = width;
        }

        for (var i = 0; i < this._modifiers.length; i++) {
            var spec = this._modifiers[i].modify({
                target: this._items[i].render()
            });

            specs.push(spec);
        }

        return specs;
    };

    module.exports = FlexGrid;
});
