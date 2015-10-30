var calculateTickMarkPositionsForGivenRange = require('./calculateTickMarkPositionsForGivenRange');
import React, {PropTypes} from 'react';
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
var getXCenterOfRowAnnotation = require('./getXCenterOfRowAnnotation');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var AxisContainer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        row: PropTypes.object,
        tickSpacing: PropTypes.number,
        bpsPerRow: PropTypes.number,
        charWidth: PropTypes.number,
        annotationHeight: PropTypes.number,
    },

    render: function() {
        var {
            row,
            tickSpacing,
            bpsPerRow,
            charWidth,
            annotationHeight
        } = this.props;

        var result = getXStartAndWidthOfRowAnnotation(row, bpsPerRow, charWidth);
        var xStart = result.xStart;
        var width = result.width;
        //this function should take in a desired tickSpacing (eg 10 bps between tick mark)
        //and output an array of tickMarkPositions for the given row (eg, [0, 10, 20])
        var xEnd = xStart + width;

        var yStart = 0;
        var tickMarkPositions = calculateTickMarkPositionsForGivenRange({tickSpacing, range: row});
        var tickMarkSVG = [];
        tickMarkPositions.forEach(function(tickMarkPosition) {
            var xCenter = getXCenterOfRowAnnotation({
                start: tickMarkPosition,
                end: tickMarkPosition
            }, bpsPerRow, charWidth);
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
                          {row.start + tickMarkPosition}
                      </text>);
        });

        return (
            <svg className="tickMarkContainer" width="100%" height={annotationHeight*1.2} >
                {tickMarkSVG}
                <path
                key={'axis ' + row.rowNumber}
                d={"M" + xStart + "," + yStart + " L" + xEnd + "," + yStart}
                stroke={'black'} />
            </svg>
        );

        
    }
});

module.exports = AxisContainer;