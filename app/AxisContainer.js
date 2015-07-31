var React = require('react');
var classnames = require('classnames');
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
var getXCenterOfRowAnnotation = require('./getXCenterOfRowAnnotation');


var AxisContainer = React.createClass({
  render: function () {
    var {row, bpsPerRow, charWidth, annotationHeight, tickSpacing} = this.props;
    var {xStart, width} = getXStartAndWidthOfRowAnnotation(row, bpsPerRow, charWidth);
    //this function should take in a desired tickSpacing (eg 10 bps between tick mark)
    //and output an array of tickMarkPositions for the given row (eg, [0, 10, 20])
    function calculateTickMarkPositionsForGivenRow (tickSpacing, row) {
      var rowLength = row.end - row.start;
      var firstTickOffsetFromRowStart = tickSpacing - (row.start % tickSpacing);
      var arrayOfTickMarkPositions = [];
      for (var tickMarkPositions = firstTickOffsetFromRowStart; tickMarkPositions < rowLength; tickMarkPositions+=tickSpacing) {
        arrayOfTickMarkPositions.push(tickMarkPositions);
      }
      return arrayOfTickMarkPositions;
    }
    xEnd = xStart + width;
    yStart = 0;
    var tickMarkPositions = calculateTickMarkPositionsForGivenRow(tickSpacing,row);
    tickMarkSVG = [];
    tickMarkPositions.forEach(function (tickMarkPosition) {
       var xCenter = getXCenterOfRowAnnotation({start: tickMarkPosition, end: tickMarkPosition}, bpsPerRow, charWidth);
       var yStart = 0;
       var yEnd = annotationHeight/3;
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