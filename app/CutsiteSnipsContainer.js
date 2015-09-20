var assign = require('lodash/object/assign');
let React = require('react');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
let getOverlapsOfPotentiallyCircularRanges = require('ve-range-utils/getOverlapsOfPotentiallyCircularRanges');
let PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var snipStyle = {
    height: "100%",
    background: 'black',
    position: "absolute",
    top: "0",
    width: "1px",
};
var snipConnectorStyle = {
    height: "1px",
    background: 'black',
    position: "absolute",
    top: "0",
};

// var cursor = getCursorForRow(caretPosition, row, bpsPerRow, snipStyle, charWidth, true);

function getSnipForRow(snipPosition, row, sequenceLength, bpsPerRow, snipStyle, charWidth, index) {
    //tnrtodo: refactor this get position in row into a helper function!
    //it is used here and in the caret position calculations!
    if (row.start <= snipPosition && row.end + 1 >= snipPosition || (row.end === sequenceLength - 1 && row.end < snipPosition)) {
        //the second logical operator catches the special case where we're at the very end of the sequence..
        var newCursorStyle = assign({}, snipStyle, {
            left: (snipPosition - row.start) * charWidth
        });
        var cursorEl = <div key={index} className="snip" style={newCursorStyle}/>
        return (cursorEl);
        // onHover={self.onCursorHover}
    }
}

function getSnipConnector(snipRange, row, sequenceLength, bpsPerRow, snipConnectorStyle, charWidth, index) {
    //tnr: we basically need to first determine what the range start and end are..
    //then mask the range by the row
    var overlaps = getOverlapsOfPotentiallyCircularRanges(snipRange, row, sequenceLength);
    return overlaps.map(function(overlap) {
        //the second logical operator catches the special case where we're at the very end of the sequence..
        var newCursorStyle = assign({}, snipConnectorStyle, {
            left: (overlap.start - row.start) * charWidth,
            width: (overlap.end - overlap.start) * charWidth,
        });
        var cursorEl = <div key={index} className="snipConnector" style={newCursorStyle}/>
        return (cursorEl);
    });


    // onHover={self.onCursorHover}
}

let CutsiteSnipsContainer = React.createClass({
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
            sequenceLength,
            topStrand
        } = this.props
        var snips = [];
        var snipConnectors = [];

        annotationRanges.forEach(function(annotationRange, index) {
            var {
                annotation
            } = annotationRange;
            var {
                downstreamTopSnip,
                downstreamBottomSnip,
                upstreamBottomSnip,
                upstreamTopSnip,
                upstreamTopBeforeBottom,
                downstreamTopBeforeBottom
            } = annotation
            var newSnip;
            var newConnector;
            var snipRange = {};
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
                        snipRange.start = downstreamTopSnip;
                        snipRange.end = downstreamBottomSnip;
                    }
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
                        snipRange.start = upstreamTopSnip;
                        snipRange.end = upstreamBottomSnip;
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


module.exports = CutsiteSnipsContainer;