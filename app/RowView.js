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
    var [a, , b] = [1,2,3];
    var odds = evens.map(v => v + 1);
    var o = {p: 42, q: true};
    var {p, q} = o;


    var {preloadBasepairStart, viewportDimensions, preloadRowStart, sequenceData} = this.props; //start the loading of the sequence with this basepair

    //prepare
    rowLength = Math.floor(viewportDimensions.width / CHAR_WIDTH);
    totalRows = Math.ceil(sequenceData.sequence.length / rowLength);
    preloadRowStart = (Math.floor(preloadBasepairStart / rowLength) - 3) > 0 ? Math.floor(preloadBasepairStart / rowLength) - 3 : 0; //get three below the top row if possible //start the loading of the sequence with this basepair
    numberOfRowsToDisplay = Math.ceil(viewportDimensions.height / averageRowHeight) + 3 < totalRows ? : totalRows
    // preloadRowEnd =
    // {preloadRowStart, preloadRowEnd, rowLength} = get
    // var sequenceData = this.props.sequenceData;
    // var visibilityParameters = this.props.visibilityParameters;
    // var preloadBasepairStart = visibilityParameters.preloadBasepairStart ? visibilityParameters //start the loading of the sequence with this basepair

    //calculate topSpacer height
    var topSpacerHeight = visibilityParameters.preloadRowStart*300;


    //calculate the visible rows
    var rows = prepareRowData(sequenceData, preloadRowStart, preloadRowEnd, rowLength);

    var rowItems = rows.map(function(row) {
      if (row) {
        return(<RowItem key={row.rowNumber} row={row} visibilityParameters={visibilityParameters} />);
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
    var topSpacerHeight = visibilityParameters.preloadRowEnd*300;












    return (
      <div>
        SequenceEditor2
        <div className="infiniteContainer" style={style} onScroll={this.onScroll}>
          <div className="topSpacer"/>
          {rowItems}
          <div className="bottomSpacer"/> </div>

      </div>
    );
  }
});

module.exports = RowView;
