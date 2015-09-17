var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
var assign = require('lodash/object/assign');
let React = require('react');
var Caret = require('./Caret');
let getOverlapsOfPotentiallyCircularRanges = require('ve-range-utils/getOverlapsOfPotentiallyCircularRanges');
let PureRenderMixin = require('react/addons').addons.PureRenderMixin;
let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');

var highlightLayerStyle = {
    height: "98%",
    background: 'blue',
    position: "absolute",
    top: "0",
    opacity: ".3",
};

var cursorStyle = {
    height: "98%",
    background: 'black',
    position: "absolute",
    top: "0",
    width: "2px",
    cursor: "ew-resize",
};


let HighlightLayer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        charWidth: React.PropTypes.number.isRequired,
        bpsPerRow: React.PropTypes.number.isRequired,
        row: React.PropTypes.object.isRequired,
        sequenceLength: React.PropTypes.number.isRequired,
        selectionLayer: React.PropTypes.object.isRequired,
    },
    handleContextMenu: function (event) {
        debugger;
        event.preventDefault();
        event.stopPropagation();
    },
    render: function() {
        var {
            charWidth,
            bpsPerRow,
            row,
            sequenceLength,
            selectionLayer,
        } = this.props;
        if (selectionLayer.selected) {
            var startSelectionCursor;
            var endSelectionCursor;
            var overlaps = getOverlapsOfPotentiallyCircularRanges(selectionLayer, row, sequenceLength);
            var selectionLayers = overlaps.map(function(overlap, index) {
                if (overlap.start === selectionLayer.start) {
                    startSelectionCursor = (<Caret 
                        charWidth={charWidth}
                        row={row}
                        sequenceLength={sequenceLength}
                        shouldBlink={!selectionLayer.cursorAtEnd}
                        caretPosition= {overlap.start} />)
                }
                if (overlap.end === selectionLayer.end) {
                    endSelectionCursor = (<Caret 
                        charWidth={charWidth}
                        row={row}
                        sequenceLength={sequenceLength}
                        shouldBlink={selectionLayer.cursorAtEnd}
                        caretPosition= {overlap.end + 1} />)
                }
                var result = getXStartAndWidthOfRowAnnotation(overlap, bpsPerRow, charWidth);
                var xStart = result.xStart;
                var width = result.width;

                var style = assign({}, highlightLayerStyle, {
                    width: width,
                    left: xStart
                });
                return (<div key={index} className="selectionLayer" style={style}/>);
            });
            return (
                <div onContextMenu={function (argument) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.setState({showContext: true})
                }}>
                    {startSelectionCursor}
                    {selectionLayers}
                    {endSelectionCursor}
                </div>
            );
        } else {
            return null;
        }
    }
});


module.exports = HighlightLayer;