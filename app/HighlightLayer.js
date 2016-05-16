import React, { PropTypes } from 'react';
import Caret from './Caret';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { propTypes } from './react-props-decorators.js';
import styles from './highlight-layer.css';
import getXStartAndWidthOfRowAnnotation from './getXStartAndWidthOfRowAnnotation';
import getOverlapsOfPotentiallyCircularRanges from 've-range-utils/getOverlapsOfPotentiallyCircularRanges';
import mixin from './mixin';

@propTypes({
    bpsPerRow: PropTypes.number.isRequired,
    charWidth: PropTypes.number.isRequired,
    color: PropTypes.string,
    regions: PropTypes.array.isRequired,
    row: PropTypes.object.isRequired,
    sequenceLength: PropTypes.number.isRequired,
    shouldBlink: React.PropTypes.bool.isRequired
})

export default class HighlightLayer extends React.Component {
    render() {
        var {
            bpsPerRow,            
            charWidth,
            color,
            regions,                    
            row,
            sequenceLength,
            shouldBlink
        } = this.props;

        var selectionLayers;

        for (let i = 0; i < regions.length; i++) {
            let selectionLayer = regions[i];

            if (selectionLayer.selected) {
                var startSelectionCursor;
                var endSelectionCursor;
                var overlaps = getOverlapsOfPotentiallyCircularRanges(selectionLayer, row, sequenceLength);
                let layers = overlaps.map(function(overlap, index) {
                    if (overlap.start === selectionLayer.start) {
                        startSelectionCursor = (<Caret
                                                charWidth={charWidth}
                                                row={row}
                                                sequenceLength={sequenceLength}
                                                shouldBlink={!selectionLayer.cursorAtEnd}
                                                caretPosition={overlap.start} />);
                    }
                    if (overlap.end === selectionLayer.end) {
                        endSelectionCursor = (<Caret
                                              charWidth={charWidth}
                                              row={row}
                                              sequenceLength={sequenceLength}
                                              shouldBlink={selectionLayer.cursorAtEnd}
                                              caretPosition={overlap.end + 1} />);
                    }
                    var result = getXStartAndWidthOfRowAnnotation(overlap, bpsPerRow, charWidth);
                    var xStart = result.xStart;
                    var width = result.width;

                    var style = {
                        width: width,
                        left: xStart
                    };

                    if (color !== undefined) {
                        style.background = color;
                    }

                    return (<div key={index} className={styles.selectionLayer} style={style}/>);
                });

                selectionLayers = selectionLayers || [];
                selectionLayers.push(layers);
            }
        }

        if (selectionLayers !== undefined && selectionLayers.length > 0) {
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
        }
        return null;
    }
}

mixin(HighlightLayer, PureRenderMixin);

module.exports = HighlightLayer;