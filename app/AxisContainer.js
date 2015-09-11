var React = require('react');
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
var getXCenterOfRowAnnotation = require('./getXCenterOfRowAnnotation');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var AxisContainer = React.createClass({
  mixins: [PureRenderMixin],
  
  render: function () {
    var row = this.props.row;
    var tickSpacing = this.props.tickSpacing;
    var bpsPerRow = this.props.bpsPerRow;
    var charWidth = this.props.charWidth;
    var annotationHeight = this.props.annotationHeight;

    var result = getXStartAndWidthOfRowAnnotation(this.props.row, this.props.bpsPerRow, this.props.charWidth);
    var xStart = result.xStart;
    var width = result.width;
    //this function should take in a desired this.props.tickSpacing (eg 10 bps between tick mark)
    //and output an array of tickMarkPositions for the given row (eg, [0, 10, 20])
    var xEnd = xStart + width;
    var yStart = 0;
    var tickMarkPositions = calculateTickMarkPositionsForGivenRow(tickSpacing, row);
    var tickMarkSVG = [];
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