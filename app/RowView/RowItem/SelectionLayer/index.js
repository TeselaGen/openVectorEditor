import React, {PropTypes} from 'react';
import Caret from '../Caret';
import './style.scss';

// var getXStartAndWidthOfRangeWrtRow = require('../getXStartAndWidthOfRangeWrtRow');
let getOverlapsOfPotentiallyCircularRanges = require('ve-range-utils/getOverlapsOfPotentiallyCircularRanges');
import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';

// function mixin(target, source) {
//     target = target.prototype;

//     Object.getOwnPropertyNames(source).forEach((name) => {
//         let sourceProp = Object.getOwnPropertyDescriptor(source, name);

//         if (name !== "constructor") {
//             Object.defineProperty(target, name, sourceProp);
//         }
//     });
// }

// move this into shared utils
function getXStartAndWidthOfRangeWrtRow(range, row, bpsPerRow, charWidth, sequenceLength) {
    return {
        xStart: normalizePositionByRangeLength(range.start - row.start, sequenceLength) * charWidth,
        width: (normalizePositionByRangeLength(range.end + 1 - range.start, sequenceLength)) * charWidth,
    };
}

export default class SelectionLayer extends React.Component {
    render() {
        var {
            charWidth,
            bpsPerRow,
            row,
            sequenceLength,
            regions,
            className: globalClassname=''
        } = this.props;

        return (
            <div>
                {regions.map(function (selectionLayer, index) {
                    var {
                        showCarets = true, 
                        className='', 
                        style={}, 
                        start, 
                        end, 
                        color 
                    } = selectionLayer
                    var classNameToPass = 'veRowViewSelectionLayer ' 
                                        + className + ' ' 
                                        + className + ' ' 
                                        + globalClassname
                    if (start > -1) {
                        var overlaps = getOverlapsOfPotentiallyCircularRanges(selectionLayer, row, sequenceLength);
                        
                        //DRAW SELECTION LAYER
                        return (overlaps.map(function(overlap, index) {
                            var {xStart, width} = getXStartAndWidthOfRangeWrtRow(overlap, row, bpsPerRow, charWidth, sequenceLength);
                            var caretSvgs = []

                            if (showCarets) {
                                //DRAW CARETS
                                caretSvgs = [
                                    (overlap.start === start) && 
                                        <Caret {...{
                                            charWidth,
                                            row,
                                            sequenceLength,
                                            className: classNameToPass,
                                            caretPosition: overlap.start
                                            }}
                                            />, 
                                        (overlap.end === end) && 
                                        <Caret {...{
                                            charWidth,
                                            row,
                                            sequenceLength,
                                            className: classNameToPass,
                                            caretPosition: overlap.end + 1
                                            }}
                                            />
                                ]
                            }
                            return [
                                <div 
                                    key={index} 
                                    className={classNameToPass} 
                                    style={{
                                        width,
                                        left: xStart,
                                        ...style,
                                        background: color
                                    }}
                                    />,
                                ...caretSvgs
                            ]
                        }))
                    }
                })}
            </div>
        );
    }
}

module.exports = SelectionLayer;
