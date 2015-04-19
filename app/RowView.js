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
      preloadBasepairStart: 150, //start the loading of the sequence with this basepair
      viewportDimensions: {
        height: 700,
        width: 400
      },
    };
  }, 
  onScroll: function (event) {
    var infiniteContainer = event.currentTarget;
    var scrollTop = infiniteContainer.scrollTop;
    // this.setState({
    //   oldScrollTop: scrollTop
    // })
    // if (scrollTop > this.state.oldScrollTop) {
    //   var scrollDirection = "up";
    //   console.log('up');
    // } else {
    //   var scrollDirection = "down";
    //   console.log('down'); 
    // } 

    var totalHeightOfInfiniteContainer = infiniteContainer.scollHeight; //equals the total height of container
    console.log(totalHeightOfInfiniteContainer); 



    //determine if we're scrolling into new territory
    //below:

    //scrollHeight 
    var topSpacer = event.currentTarget.children[0];
    var totalChildCount = event.currentTarget.childElementCount;
    var bottomSpacer = event.currentTarget.children[(totalChildCount-1)];

    if (scrollTop - topSpacer.scrollHeight < 100) {
      //we're less than 100 pixels away from hitting the top spacer
      console.log("top true");
    } 

    console.log(scrollTop);
    console.log(bottomSpacer.offsetTop);

    if (bottomSpacer.offsetTop - infiniteContainer.clientHeight - scrollTop < 100) {
      //we're less than 100 pixels away from hitting the bottom spacer
      console.log("bottom true");
    } 

    // console.log('bottomSpacer.offsetTop');
    // console.log(bottomSpacer.offsetTop);
     // console.log(bottomSpacer);
    console.log(event.currentTarget.scrollBottom);

  },

  componentDidMount: function (argument) {
    var infiniteContainer = React.findDOMNode(this.refs.infiniteContainer);
    var heightOfTopSpacer = React.findDOMNode(this.refs.topSpacer).scrollHeight;
    if (heightOfTopSpacer > 0) {
      var thirdRowElement = infiniteContainer.children[3].scrollIntoView();
    }
  },

  render: function () {
    var {preloadBasepairStart, viewportDimensions, sequenceData, ...other} = this.props; //start the loading of the sequence with this basepair
    var averageRowHeight = 100;

    //prepare the infinite container dimension
    var rowLength = Math.floor(viewportDimensions.width / CHAR_WIDTH);
    var totalRows = Math.ceil(sequenceData.sequence.length / rowLength);
    var preloadRowStart = (Math.floor(preloadBasepairStart / rowLength) - 3) > 0 ? Math.floor(preloadBasepairStart / rowLength) - 3 : 0; //get three below the top row if possible //start the loading of the sequence with this basepair
    var rowsThatFitIntoViewport = Math.ceil(viewportDimensions.height / averageRowHeight) + 20;
    var numberOfRowsToDisplay = (preloadRowStart + rowsThatFitIntoViewport + 3) < totalRows ? preloadRowStart + rowsThatFitIntoViewport + 3 : totalRows;
    var preloadRowEnd = preloadRowStart + numberOfRowsToDisplay; 

    //calculate topSpacer height
    var topSpacerHeight = preloadRowStart*averageRowHeight;

    //calculate the visible rows
    var alreadyPreparedRows = {};//tnr: pass any already prepared rows into this function so we don't have to recalculate them
    var rows = prepareRowData(sequenceData, preloadRowStart, preloadRowEnd, rowLength, alreadyPreparedRows); 
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
        <div ref="infiniteContainer" className="infiniteContainer" style={style} onScroll={this.onScroll}>
            <div ref="topSpacer" className="topSpacer" style={{height: topSpacerHeight}}/>
            {rowItems}
            <div className="bottomSpacer" style={{height: bottomSpacerHeight}}/> 
        </div>
      </div>
    );
  }
});

module.exports = RowView;
