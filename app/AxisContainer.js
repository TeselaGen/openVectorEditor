var React = require('react');
var classnames = require('classnames');
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
var getXCenterOfRowAnnotation = require('./getXCenterOfRowAnnotation');


var AxisContainer = React.createClass({
  render: function () {
    var result = getXStartAndWidthOfRowAnnotation(this.props.row, this.props.bpsPerRow, this.props.charWidth);
    var xStart = result.xStart;
    var width = result.width;
    //this function should take in a desired this.props.tickSpacing (eg 10 bps between tick mark)
    //and output an array of tickMarkPositions for the given row (eg, [0, 10, 20])
    xEnd = xStart + width;
    yStart = 0;
    var tickMarkPositions = calculateTickMarkPositionsForGivenRow(this.props.tickSpacing,this.props.row);
    tickMarkSVG = [];
    tickMarkPositions.forEach(function (tickMarkPosition) {
       var xCenter = getXCenterOfRowAnnotation({start: tickMarkPosition, end: tickMarkPosition}, this.props.bpsPerRow, this.props.charWidth);
       var yStart = 0;
       var yEnd = this.props.annotationHeight/3;
       tickMarkSVG.push(<path
        key={'axisTickMark ' + this.props.row.rowNumber + ' ' + tickMarkPosition}
        d={"M" + xCenter + "," + yStart + " L" + xCenter + "," + yEnd}
        stroke={'black'} />);
       tickMarkSVG.push(
        <text
          key={'axisTickMarkText ' + this.props.row.rowNumber + ' ' + tickMarkPosition}
          stroke={'black'}
          x={xCenter}
          y={this.props.annotationHeight}
          style={{"textAnchor": "middle", "fontSize": 10, "fontFamily": "Verdana"}}
          >
          {this.props.row.start + tickMarkPosition}
        </text>);
    });

    return (
      <svg className="tickMarkContainer" width="100%" height={this.props.annotationHeight*1.2} >
        {tickMarkSVG}
        <path
        key={'axis ' + this.props.row.rowNumber}
        d={"M" + xStart + "," + yStart + " L" + xEnd + "," + yStart}
        stroke={'black'} />
      </svg>
    );

    function calculateTickMarkPositionsForGivenRow (tickSpacing, row) {
      var rowLength = row.end - row.start;
      var firstTickOffsetFromRowStart = tickSpacing - (row.start % tickSpacing);
      var arrayOfTickMarkPositions = [];
      for (var tickMarkPositions = firstTickOffsetFromRowStart; tickMarkPositions < rowLength; tickMarkPositions+=tickSpacing) {
        arrayOfTickMarkPositions.push(tickMarkPositions);
      }
      return arrayOfTickMarkPositions;
    }
  }
});

module.exports = AxisContainer;