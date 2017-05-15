import norm from 've-range-utils/normalizePositionByRangeLength';
var assign = require('lodash/object/assign');
let React = require('react');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
let getOverlapsOfPotentiallyCircularRanges = require('ve-range-utils/getOverlapsOfPotentiallyCircularRanges');
let PureRenderMixin = require('react-addons-pure-render-mixin');
import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';
import getXStartAndWidthOfRowAnnotation from '../../../shared-utils/getXStartAndWidthOfRowAnnotation';

function getXStartAndWidthOfRangeWrtRow(range, row, bpsPerRow, charWidth, sequenceLength, letterSpacing) {
    var width = normalizePositionByRangeLength(range.end - range.start, sequenceLength);
    var xStart = normalizePositionByRangeLength(range.start - row.start, sequenceLength);
    xStart = ((letterSpacing + 11.2) * xStart) + 20; //move selection right

    // i'm not sure why this method is being passed upstream snips that are on the wrong row, but it is,
    // and this workaround seemed easier than digger deeper into it...
    if (range.start > row.end) {
        xStart = null;
    }

    return {
        xStart: xStart,
        width: width,
    };
}

function getSnipForRow(snipPosition, row, sequenceLength, bpsPerRow, snipStyle, charWidth, index, letterSpacing) {
    var {xStart, width} = getXStartAndWidthOfRangeWrtRow({start: snipPosition, end: snipPosition}, row, bpsPerRow, charWidth, sequenceLength, letterSpacing);
    //TODO: refactor this get position in row into a helper function!
    //it is used here and in the caret position calculations!
    // if (row.start <= snipPosition && row.end + 1 >= snipPosition
    //     || (row.end === sequenceLength - 1 && row.end < snipPosition) //catch the special case where we're at the very end of the sequence..
    //     ) {

    // }
    if (!xStart) {
        return null;
    }
    var newCursorStyle = assign({}, snipStyle, {
        left: xStart
    });
    var cursorEl = <div key={index} className="veRowViewCutsite snip" style={newCursorStyle}/>
    return (cursorEl);
}

function getSnipConnector(snipRange, row, sequenceLength, bpsPerRow, snipConnectorStyle, charWidth, index, letterSpacing) {
    var overlaps = getOverlapsOfPotentiallyCircularRanges(snipRange, {...row, end: row.end+1}, sequenceLength);
    return overlaps.map(function(overlap, index2) {
        var {xStart, width} = getXStartAndWidthOfRangeWrtRow(overlap, row, bpsPerRow, charWidth, sequenceLength, letterSpacing);
        if (!xStart) {
            return null;
        }
        //the second logical operator catches the special case where we're at the very end of the sequence..
        var newCursorStyle = assign({}, snipConnectorStyle, {
            left: xStart,
            width: width * (letterSpacing + 11.2) + 2 // extra 2 in order to extend to the edge of right-most vertical bar
        });
        var cursorEl = <div key={index+index2} className="veRowViewCutsite snipConnector" style={newCursorStyle}/>
        return (cursorEl);
    });
}

let Cutsites = React.createClass({

    componentWillMount: function() {
        var bpsPerRow = this.props.bpsPerRow;
        var charWidth = this.props.charWidth;

        let viewBoxWidth = bpsPerRow * charWidth * 1.2 + 40; // 1.2 & 40 for padding
        let rowWidth = bpsPerRow * (charWidth-1) * 1.2;
        let totalWidth = (rowWidth * (bpsPerRow * (charWidth - 1))) / viewBoxWidth;
        var letterSpacing = ((totalWidth - 10) - 11.2*bpsPerRow) / (bpsPerRow - 1); // this 11.2 is default letterSpacing
        this.state = {
            letterSpacing: letterSpacing,
        }
    },

    componentWillReceiveProps: function(newProps) {
        if (newProps.bpsPerRow !== this.props.bpsPerRow) {
            var bpsPerRow = newProps.bpsPerRow;
            var charWidth = newProps.charWidth;

            let viewBoxWidth = bpsPerRow * charWidth * 1.2 + 40; // 1.2 & 40 for padding
            let rowWidth = bpsPerRow * (charWidth-1) * 1.2;
            let totalWidth = (rowWidth * (bpsPerRow * (charWidth - 1))) / viewBoxWidth;
            var letterSpacing = ((totalWidth - 10) - 11.2*bpsPerRow) / (bpsPerRow - 1); // this 11.2 is default letterSpacing
            this.setState({ letterSpacing: letterSpacing });
        }
    },

    render: function() {
        var {
            annotationRanges,
            charWidth,
            bpsPerRow,
            row,
            HoverHelper,
            sequenceHeight,
            sequenceLength,
            topStrand,
            showAminoAcids,
            showReverseSequence,
        } = this.props
        var letterSpacing = this.state.letterSpacing;

        sequenceHeight += 5;
        var offset = sequenceHeight - 2;
        var snipStyle = {
            height: sequenceHeight + "px",
            position: "absolute",
            top: "-1px",
            width: "2px",
        };
        var reverseHiddenSnipStyle = {
            height: "8px",
            position: "absolute",
            top: "-1px",
            width: "2px",
        };
        var snipConnectorStyle = {
            height: "2px",
            position: "absolute",
            top: offset + "px",
        };

        var snips = [];
        var snipConnectors = [];
        Object.keys(annotationRanges).forEach(function(key) {
            var annotationRange = annotationRanges[key]
            var {
                annotation
            } = annotationRange;
            if (!annotation) {
                annotation = annotationRange
            }
            var {
                downstreamTopSnip,
                downstreamBottomSnip,
                upstreamBottomSnip,
                upstreamTopSnip,
                upstreamTopBeforeBottom,
                downstreamTopBeforeBottom
            } = annotation
            snipStyle = {...snipStyle, background: annotation.restrictionEnzyme.color || 'black'}
            reverseHiddenSnipStyle = {...reverseHiddenSnipStyle, background: annotation.restrictionEnzyme.color || 'black'}
            snipConnectorStyle = {...snipConnectorStyle, background: annotation.restrictionEnzyme.color || 'black'}

            var newSnip;
            var newConnector;
            var snipRange = {};
            if (areNonNegativeIntegers([downstreamBottomSnip, downstreamTopSnip])) {
                if (topStrand) {
                    newSnip = getSnipForRow(downstreamTopSnip, row, sequenceLength, bpsPerRow, snipStyle, charWidth, key+'downstream', letterSpacing);
                    if (newSnip) {
                        snips.push(newSnip)
                    }
                } else {
                    snipStyle = showReverseSequence ? snipStyle : reverseHiddenSnipStyle;
                    snipStyle.top = offset + 'px';
                    newSnip = getSnipForRow(downstreamBottomSnip, row, sequenceLength, bpsPerRow, snipStyle, charWidth, key+'downstream', letterSpacing);
                    if (newSnip) {
                        snips.push(newSnip)
                    }
                    if (downstreamTopBeforeBottom) {
                        snipRange.start = downstreamTopSnip;
                        snipRange.end = downstreamBottomSnip;
                    } else {
                        snipRange.start = downstreamBottomSnip;
                        snipRange.end = downstreamTopSnip;
                    }
                    newConnector = getSnipConnector(snipRange, row, sequenceLength, bpsPerRow, snipConnectorStyle, charWidth, key+'downstreamConnector', letterSpacing);
                    snipConnectors.push(newConnector)
                }
            }
            if (areNonNegativeIntegers([upstreamBottomSnip, upstreamTopSnip])) {
                if (topStrand) {
                    newSnip = getSnipForRow(upstreamTopSnip, row, sequenceLength, bpsPerRow, snipStyle, charWidth, key + 'upstream', letterSpacing);
                    if (newSnip) {
                        snips.push(newSnip)
                    }
                } else {
                    snipStyle = showReverseSequence ? snipStyle : reverseHiddenSnipStyle;
                    snipStyle.top = offset + 'px';
                    newSnip = getSnipForRow(upstreamBottomSnip, row, sequenceLength, bpsPerRow, snipStyle, charWidth, key + 'upstream', letterSpacing);
                    if (newSnip) {
                        snips.push(newSnip)
                    }
                    if (upstreamTopBeforeBottom) {
                        snipRange.start = upstreamTopSnip;
                        snipRange.end = upstreamBottomSnip;
                    } else {
                        snipRange.start = upstreamBottomSnip;
                        snipRange.end = upstreamTopSnip;
                    }
                    newConnector = getSnipConnector(snipRange, row, sequenceLength, bpsPerRow, snipConnectorStyle, charWidth, key + 'upstreamConnector', letterSpacing);
                    snipConnectors.push(newConnector)
                }
            }
        });
        return (
            <div>
                {snips}
                {snipConnectors}
            </div>
        )
    }
});

module.exports = Cutsites;
