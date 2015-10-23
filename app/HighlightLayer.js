import getXStartAndWidthOfRowAnnotation from './getXStartAndWidthOfRowAnnotation';
import assign from 'lodash/object/assign';
import React from 'react';
import Caret from './Caret';
import getOverlapsOfPotentiallyCircularRanges from 've-range-utils/getOverlapsOfPotentiallyCircularRanges';
import PureRenderMixin from 'react-addons-pure-render-mixin';

var highlightLayerStyle = {
    height: "98%",
    position: "absolute",
    top: "0",
    opacity: ".3",
};

let HighlightLayer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        charWidth: React.PropTypes.number.isRequired,
        bpsPerRow: React.PropTypes.number.isRequired,
        color: React.PropTypes.string,
        row: React.PropTypes.object.isRequired,
        sequenceLength: React.PropTypes.number.isRequired,
        selectionLayer: React.PropTypes.object.isRequired,
    },
    render: function() {
        var {
            charWidth,
            bpsPerRow,
            row,
            sequenceLength,
            selectionLayer,
            color
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
                    left: xStart,
                    background: color ? color : 'blue' 
                });
                return (<div key={index} className="selectionLayer" style={style}/>);
            });
            return (
                <div onContextMenu={function (event) {
                    //tnrtodo: add context menu here
                    event.preventDefault();
                    event.stopPropagation();
                }}>
                    {selectionLayers}
                    {startSelectionCursor}
                    {endSelectionCursor}
                </div>
            );
        } else {
            return null;
        }
    }
});


export default HighlightLayer;