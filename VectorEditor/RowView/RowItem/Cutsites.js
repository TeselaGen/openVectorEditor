import norm from 've-range-utils/normalizePositionByRangeLength';
var assign = require('lodash/assign');
let React = require('react');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
let getOverlapsOfPotentiallyCircularRanges = require('ve-range-utils/getOverlapsOfPotentiallyCircularRanges');
let PureRenderMixin = require('react-addons-pure-render-mixin');
import getXStartAndWidthOfRangeWrtRow from './getXStartAndWidthOfRangeWrtRow';
var snipStyle = {
    height: "100%",
    // background: 'black',
    position: "absolute",
    top: "0px",
    width: "2px",
};
var snipConnectorStyle = {
    height: "2px",
    // background: 'black',
    position: "absolute",
    top: "0px",
};

// var cursor = getCursorForRow(caretPosition, row, bpsPerRow, snipStyle, charWidth, true);

function getSnipForRow(snipPosition, row, sequenceLength, bpsPerRow, snipStyle, charWidth, index) {
    //console.log('snipPosition: ' + JSON.stringify(snipPosition,null,4));
    var {xStart, width} = getXStartAndWidthOfRangeWrtRow({start: snipPosition, end: snipPosition}, row, bpsPerRow, charWidth, sequenceLength);
    //tnrtodo: refactor this get position in row into a helper function!
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
    return overlaps.map(function(overlap) {
        //console.log('overlap: ' + JSON.stringify(overlap,null,4));
        var {xStart, width} = getXStartAndWidthOfRangeWrtRow(overlap, row, bpsPerRow, charWidth, sequenceLength);
        width -= charWidth
        //the second logical operator catches the special case where we're at the very end of the sequence..
        var newCursorStyle = assign({}, snipConnectorStyle, {
            left: xStart,
            width
        });
        var cursorEl = <div key={index} className="veRowViewCutsite snipConnector" style={newCursorStyle}/>
        return (cursorEl);
    });
}

let Cutsites = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        annotationRanges: React.PropTypes.array.isRequired,
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
            height,
            sequenceLength,
            topStrand
        } = this.props
        var snips = [];
        var snipConnectors = [];
        //console.log('annotationRanges: ' + JSON.stringify(annotationRanges,null,4));
        Object.keys(annotationRanges).forEach(function(key, index) {
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
            snipConnectorStyle = {...snipConnectorStyle, background: annotation.restrictionEnzyme.color || 'black'}

            var newSnip;
            var newConnector;
            var snipRange = {};
            //console.log('downstreamBottomSnip: ' + JSON.stringify(downstreamBottomSnip,null,4));
            //console.log('downstreamTopSnip: ' + JSON.stringify(downstreamTopSnip,null,4));
            if (areNonNegativeIntegers([downstreamBottomSnip, downstreamTopSnip])) {
                if (topStrand) {
                    newSnip = getSnipForRow(downstreamTopSnip, row, sequenceLength, bpsPerRow, snipStyle, charWidth, index);
                    if (newSnip) {
                        snips.push(newSnip)
                    }
                } else {
                    newSnip = getSnipForRow(downstreamBottomSnip, row, sequenceLength, bpsPerRow, snipStyle, charWidth, index);
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
                    //console.log('snipRange: ' + JSON.stringify(snipRange,null,4));
                    newConnector = getSnipConnector(snipRange, row, sequenceLength, bpsPerRow, snipConnectorStyle, charWidth, index);
                    snipConnectors.push(newConnector)
                }
            }
            if (areNonNegativeIntegers([upstreamBottomSnip, upstreamTopSnip])) {
                if (topStrand) {
                    newSnip = getSnipForRow(upstreamTopSnip, row, sequenceLength, bpsPerRow, snipStyle, charWidth, index);
                    if (newSnip) {
                        snips.push(newSnip)
                    }
                } else {
                    newSnip = getSnipForRow(upstreamBottomSnip, row, sequenceLength, bpsPerRow, snipStyle, charWidth, index);
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
                    newConnector = getSnipConnector(snipRange, row, sequenceLength, bpsPerRow, snipConnectorStyle, charWidth, index);
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