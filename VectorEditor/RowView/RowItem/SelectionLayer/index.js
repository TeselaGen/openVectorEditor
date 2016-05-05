import React, {PropTypes} from 'react';
import Caret from '../Caret';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import './style.scss';

var getXStartAndWidthOfRangeWrtRow = require('../getXStartAndWidthOfRangeWrtRow');
let getOverlapsOfPotentiallyCircularRanges = require('ve-range-utils/getOverlapsOfPotentiallyCircularRanges');

function mixin(target, source) {
    target = target.prototype;

    Object.getOwnPropertyNames(source).forEach((name) => {
        let sourceProp = Object.getOwnPropertyDescriptor(source, name);

        if (name !== "constructor") {
            Object.defineProperty(target, name, sourceProp);
        }
    });
}

export default class SelectionLayer extends React.Component {
    render() {
        var {
            charWidth,
            bpsPerRow,
            row,
            sequenceLength,
            regions,
            className=''
        } = this.props;
        var selectionLayers;

        for (let i = 0; i < regions.length; i++) {
            let selectionLayer = regions[i];
            var {showCarets = true} = selectionLayer
            var classNameToPass = 'veRowViewSelectionLayer ' + className + ' ' + selectionLayer.className

            if (selectionLayer.start > -1) {
                var startSelectionCursor;
                var endSelectionCursor;
                var overlaps = getOverlapsOfPotentiallyCircularRanges(selectionLayer, row, sequenceLength);
                
                let layers = overlaps.map(function(overlap, index) {
                    //console.log('overlap: ' + JSON.stringify(overlap,null,4));
                    if (showCarets) {
                        //DRAW CARETS
                        if (overlap.start === selectionLayer.start) {
                            startSelectionCursor = <Caret {...{
                                charWidth,
                                row,
                                sequenceLength,
                                className: classNameToPass,
                                caretPosition: overlap.start
                            }}
                            />;
                        }
                        if (overlap.end === selectionLayer.end) {
                            endSelectionCursor = <Caret {...{
                                charWidth,
                                row,
                                sequenceLength,
                                className: classNameToPass,
                                caretPosition: overlap.end + 1
                            }}
                            />;
                        }
                    }

                    //DRAW SELECTION LAYER
                    var {xStart, width} = getXStartAndWidthOfRangeWrtRow(overlap, row, bpsPerRow, charWidth, sequenceLength);

                    return (<div key={index} className={classNameToPass} style={{
                        width: width,
                        left: xStart,
                        ...selectionLayer.style
                        
                    }}/>);
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

mixin(SelectionLayer, PureRenderMixin);

module.exports = SelectionLayer;
