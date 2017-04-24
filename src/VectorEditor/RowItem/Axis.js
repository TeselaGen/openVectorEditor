var normalizePositionByRangeLength = require('ve-range-utils/normalizePositionByRangeLength');
import getXStartAndWidthOfRangeWrtRow from './getXStartAndWidthOfRangeWrtRow';
import React, {PropTypes} from 'react';
import calculateTickMarkPositionsForGivenRange from '../utils/calculateTickMarkPositionsForGivenRange';
var getXCenterOfRowAnnotation = require('./getXCenterOfRowAnnotation');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Axis = React.createClass({
    mixins: [PureRenderMixin],
    render: function() {
        var {
            row,
            tickSpacing,
            bpsPerRow,
            charWidth,
            annotationHeight,
            sequenceLength
        } = this.props;
        if (row.start === 0 && row.end === 0) {
          return null
        }
        var {xStart, width} = getXStartAndWidthOfRangeWrtRow(row, row, bpsPerRow, charWidth, sequenceLength);
        //this function should take in a desired tickSpacing (eg 10 bps between tick mark)
        //and output an array of tickMarkPositions for the given row (eg, [0, 10, 20])
        var xEnd = xStart + width;

        var yStart = 0;
        var tickMarkPositions = calculateTickMarkPositionsForGivenRange({tickSpacing, range: row, sequenceLength});
        var tickMarkSVG = [];

        tickMarkPositions.forEach(function(tickMarkPosition) {
            // var xCenter = getXCenterOfRowAnnotation({
            //     start: tickMarkPosition,
            //     end: tickMarkPosition
            // }, row, bpsPerRow, charWidth, sequenceLength);
            var xCenter = tickMarkPosition * charWidth + charWidth/2
            var yStart = 0;
            var yEnd = annotationHeight / 3;
            tickMarkSVG.push(<path
              key={'axisTickMark ' + row.rowNumber + ' ' + tickMarkPosition}
              d={"M" + xCenter + "," + yStart + " L" + xCenter + "," + yEnd}
              stroke={'black'} />);
            tickMarkSVG.push(
                <text
                          key={'axisTickMarkText ' + row.rowNumber + ' ' + tickMarkPosition}
                          stroke={'black'}
                          x={xCenter}
                          y={annotationHeight}
                          style={{"textAnchor": "middle", "fontSize": 10, "fontFamily": "Verdana"}}
                          >
                          {normalizePositionByRangeLength(row.start + tickMarkPosition, sequenceLength) + 1}
                      </text>);
        });

        return (
            <svg className="veRowViewAxis veAxis" width='100%' height={annotationHeight*1.2} >
                {tickMarkSVG}
                <path
                key={'axis ' + row.rowNumber}
                d={"M" + xStart + "," + yStart + " L" + xEnd + "," + yStart}
                stroke={'black'} />
            </svg>
        );

        
    }
});

module.exports = Axis;
