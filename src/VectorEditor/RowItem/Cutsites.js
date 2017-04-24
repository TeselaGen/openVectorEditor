import isPositionWithinRange from 've-range-utils/isPositionWithinRange';
import norm from 've-range-utils/normalizePositionByRangeLength';
var assign = require('lodash/assign');
let React = require('react');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
let getOverlapsOfPotentiallyCircularRanges = require('ve-range-utils/getOverlapsOfPotentiallyCircularRanges');
let PureRenderMixin = require('react-addons-pure-render-mixin');
import getXStartAndWidthOfRangeWrtRow from './getXStartAndWidthOfRangeWrtRow';
var snipStyle = {
    height: "111%",
    // background: 'black',
    position: "absolute",
    top: 3,
    width: "2px",
};
var snipConnectorStyle = {
    height: "2px",
    // background: 'black',
    position: "absolute",
    top: 3,
};

// var cursor = getCursorForRow(caretPosition, row, bpsPerRow, snipStyle, charWidth, true);

function getSnipForRow(snipPosition, row, sequenceLength, bpsPerRow, snipStyle, charWidth, index) {
    if (!isPositionWithinRange(snipPosition, row)) return
    var {xStart} = getXStartAndWidthOfRangeWrtRow({start: snipPosition, end: snipPosition}, row, bpsPerRow, charWidth, sequenceLength);
    //TODO: refactor this get position in row into a helper function!
    //it is used here and in the caret position calculations!
    // if (row.start <= snipPosition && row.end + 1 >= snipPosition 
    //     || (row.end === sequenceLength - 1 && row.end < snipPosition) //catch the special case where we're at the very end of the sequence..
    //     ) {
        
    // }

    var newCursorStyle = assign({}, snipStyle, {
        left: xStart
    });
    var cursorEl = <div key={index} className="veRowViewCutsite snip" style={newCursorStyle}/>
    return (cursorEl);
}

function getSnipConnector(snipRange, row, sequenceLength, bpsPerRow, snipConnectorStyle, charWidth, index) {
    //tnr: we basically need to first determine what the range start and end are..
    // var _snipRange = {
    //     ...snipRange,
    //     end: norm(snipRange.end-1,sequenceLength)
    // }
    //then mask the range by the row

    var overlaps = getOverlapsOfPotentiallyCircularRanges(snipRange, {...row, end: row.end+1}, sequenceLength);
    return overlaps.map(function(overlap, index2) {
        var {xStart, width} = getXStartAndWidthOfRangeWrtRow(overlap, row, bpsPerRow, charWidth, sequenceLength);
        width -= charWidth
        //the second logical operator catches the special case where we're at the very end of the sequence..
        var newCursorStyle = assign({}, snipConnectorStyle, {
            left: xStart,
            width
        });
        var cursorEl = <div key={index+index2} className="veRowViewCutsite snipConnector" style={newCursorStyle}/>
        return (cursorEl);
    });
}

let Cutsites = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        // annotationRanges: React.PropTypes.object.isRequired,
        charWidth: React.PropTypes.number.isRequired,
        bpsPerRow: React.PropTypes.number.isRequired,
        row: React.PropTypes.object.isRequired,
        sequenceLength: React.PropTypes.number.isRequired,
        topStrand: React.PropTypes.bool.isRequired,
    },
    render: function() {
        var {
            annotationRanges,
            charWidth,
            bpsPerRow,
            row,
            // height,
            // HoverHelper,
            sequenceLength,
            topStrand
        } = this.props
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
                topSnipPosition,
                bottomSnipPosition,
                upstreamBottomSnip,
                upstreamTopSnip,
                upstreamTopBeforeBottom,
                topSnipBeforeBottom
            } = annotation
            topSnipPosition = topSnipPosition && Number(topSnipPosition)
            bottomSnipPosition = bottomSnipPosition && Number(bottomSnipPosition)
            upstreamTopSnip = upstreamTopSnip && Number(upstreamTopSnip)
            upstreamBottomSnip = upstreamBottomSnip && Number(upstreamBottomSnip)
            
            snipStyle = {...snipStyle, background: annotation.restrictionEnzyme.color || 'black'}
            snipConnectorStyle = {...snipConnectorStyle, background: annotation.restrictionEnzyme.color || 'black'}

            var newSnip;
            var newConnector;
            var snipRange = {};
            
            if (areNonNegativeIntegers([bottomSnipPosition, topSnipPosition])) {
                if (topStrand) {
                    // if (isPositionWithinRange(topSnipPosition, row)) {}
                    newSnip = getSnipForRow(topSnipPosition, row, sequenceLength, bpsPerRow, snipStyle, charWidth, key+'downstream');
                    if (newSnip) {
                        snips.push(newSnip)
                    }
                } else {
                    newSnip = getSnipForRow(bottomSnipPosition, row, sequenceLength, bpsPerRow, snipStyle, charWidth, key+'downstream');
                    if (newSnip) {
                        snips.push(newSnip)
                    }
                    if (topSnipBeforeBottom) {
                        snipRange.start = topSnipPosition;
                        snipRange.end = bottomSnipPosition;
                    } else {
                        snipRange.start = bottomSnipPosition;
                        snipRange.end = topSnipPosition;
                    }
                    newConnector = getSnipConnector(snipRange, row, sequenceLength, bpsPerRow, snipConnectorStyle, charWidth, key+'downstreamConnector');
                    snipConnectors.push(newConnector)
                }
            }
            if (areNonNegativeIntegers([upstreamBottomSnip, upstreamTopSnip])) {
                if (topStrand) {
                    newSnip = getSnipForRow(upstreamTopSnip, row, sequenceLength, bpsPerRow, snipStyle, charWidth, key + 'upstream');
                    if (newSnip) {
                        snips.push(newSnip)
                    }
                } else {
                    newSnip = getSnipForRow(upstreamBottomSnip, row, sequenceLength, bpsPerRow, snipStyle, charWidth, key + 'upstream');
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
                    newConnector = getSnipConnector(snipRange, row, sequenceLength, bpsPerRow, snipConnectorStyle, charWidth, key + 'upstreamConnector');
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
