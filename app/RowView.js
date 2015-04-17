var React = require('react');
var RowItem = require('./RowItem');
// var InfiniteScrollContainer = require('./InfiniteScrollContainer');
var prepareRowData = require('./prepareRowData');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;
// var ReactList = require('react-list');

var RowView = React.createClass({
  propTypes: {

  },
  getDefaultProps: function() {
    return {
      preloadBasepairStart: 0, //start the loading of the sequence with this basepair
      viewportDimensions: {
        height: 700,
        width: 400
      },
    };
  },
  onScroll: function (event) {
    console.log(event.detail);
  },

  render: function () {
    var {preloadBasepairStart, viewportDimensions, sequenceData, ...other} = this.props; //start the loading of the sequence with this basepair
    var averageRowHeight = 100;

    //prepare the infinite container dimension
    var rowLength = Math.floor(viewportDimensions.width / CHAR_WIDTH);
    var totalRows = Math.ceil(sequenceData.sequence.length / rowLength);
    var preloadRowStart = (Math.floor(preloadBasepairStart / rowLength) - 3) > 0 ? Math.floor(preloadBasepairStart / rowLength) - 3 : 0; //get three below the top row if possible //start the loading of the sequence with this basepair
    var rowsThatFitIntoViewport = Math.ceil(viewportDimensions.height / averageRowHeight);
    var numberOfRowsToDisplay = (preloadRowStart + rowsThatFitIntoViewport + 3) < totalRows ? preloadRowStart + rowsThatFitIntoViewport + 3 : totalRows;
    var preloadRowEnd = preloadRowStart + numberOfRowsToDisplay; 

    //calculate topSpacer height
    var topSpacerHeight = preloadRowStart*averageRowHeight;

    //calculate the visible rows
    var rows = prepareRowData(sequenceData, preloadRowStart, preloadRowEnd, rowLength);
    console.log('rows');
    console.log(rows); 
    var rowItems = rows.map(function(row) {
      if (row) {
        return(<RowItem key={row.rowNumber} {...other} row={row} rowLength={rowLength}  />);
      }
    });
    var rowItemHeights = [];

    rowItems.forEach(function(){
      rowItemHeights.push(100);
    }); 

    var style = {
      height:viewportDimensions.height,
      width: viewportDimensions.width,
      overflowY: "scroll"
    };

    //calculate bottom spacer height
    var bottomSpacerHeight = (totalRows - preloadRowEnd)*averageRowHeight;

    return (
      <div>
        SequenceEditor2
        <div className="infiniteContainer" style={style} onScroll={this.onScroll}>
            <div className="topSpacer" style={{height: topSpacerHeight}}/>
            {rowItems}
            <div className="bottomSpacer" style={{height: bottomSpacerHeight}}/> 
        </div>
      </div>
    );
  }
});

module.exports = RowView;
