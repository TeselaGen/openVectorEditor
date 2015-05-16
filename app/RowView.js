var React = require('react');
var Draggable = require('react-draggable');
var RowItem = require('./RowItem');
var appActions = require('./actions/appActions');
var arePositiveIntegers = require('./arePositiveIntegers');
// var InfiniteScrollContainer = require('./InfiniteScrollContainer');
// var prepareRowData = require('./prepareRowData');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;
// var ReactList = require('react-list');
var mixin = require('baobab-react/mixins').branch;

var RowView = React.createClass({
  mixins: [mixin],
  cursors: {
    // visibilityParameters: ['vectorEditorState', 'visibilityParameters'],
    preloadRowStart: ['vectorEditorState', 'preloadRowStart'],
    averageRowHeight: ['vectorEditorState', 'averageRowHeight'],
    rowLength: ['vectorEditorState', 'rowLength'],
    viewportDimensions: ['vectorEditorState', 'viewportDimensions'],
    preloadBasepairStart: ['vectorEditorState', 'preloadBasepairStart'],
    highlightLayer: ['vectorEditorState', 'highlightLayer'],
  },
  facets: {
    rowData: 'rowData',
  },

  // propTypes: {
  //   preloadBasepairStart: React.PropTypes.number.isRequired,
  //   viewportDimensions: React.PropTypes.object.isRequired,
  // },
  // getDefaultProps: function() {
  //   return {
  //     preloadBasepairStart: 150, //start the loading of the sequence with this basepair
  //     viewportDimensions: {
  //       height: 700,
  //       width: 400
  //     },
  //   };
  // }, 
  onScroll: function (event) {
    if (this.scollerBeingDragged) return; //don't handle the onScroll event because the user is dragging

    //the basic idea of the scroll is to add a row below if the third row element goes out of view
    //and to add a row above if the third row element comes into view 
    //(we use the third element so we have a buffer of 2 rows above that are preloaded..)
    //after the new row is added, we manually need to set the scrollOffset of the infinite container 
    //so that the newly added row doesn't change the positions of the already existing rows on the screen
    //The logic for this is done in componentWillUpdate and componentDidUpdate

    var infiniteContainer = event.currentTarget;
    var thirdRowElement = infiniteContainer.childNodes[2]; 
    
    console.log(infiniteContainer.scrollTop);
    if ((thirdRowElement.offsetTop - infiniteContainer.offsetTop + thirdRowElement.scrollHeight) < infiniteContainer.scrollTop) {
      //scrolling down, so add a row below
      console.log('//scrolling down, so add a row below');
      this.prepareVisibleRows(this.state.preloadRowStart + 1);
      // this.thirdRowElement = thirdRowElement;
      // this.thirdRowElementScrollHeight = thirdRowElement.scrollHeight;
      this.scrollingUp = false;
    } else if (thirdRowElement.offsetTop - infiniteContainer.offsetTop > infiniteContainer.scrollTop) {
      this.prepareVisibleRows(this.state.preloadRowStart - 1);
      // this.thirdRowElement = thirdRowElement;
      // this.thirdRowElementScrollHeight = thirdRowElement.scrollHeight;
      this.scrollingUp = true;
      console.log('//scrolling up, so add a row above');
    } else {
      //we haven't scrolled enough, so do nothing
    }
  },

  componentWillUpdate: function(argument) {
    //save a reference to the thirdRowElement and its offset from the top of the container
    var infiniteContainer = React.findDOMNode(this.refs.infiniteContainer);
    this.thirdRowElement = infiniteContainer.children[2];
    this.thirdRowElementOldOffsetTop = this.thirdRowElement.offsetTop;
  },

  componentDidUpdate: function(argument) {
    //if there is no thirdRowElement, we've probably scrolled too far away
    if (this.thirdRowElement) { 
      //there is a thirdRowElement, so we want to make sure its screen position hasn't changed
      var infiniteContainer = React.findDOMNode(this.refs.infiniteContainer);
      var adjustInfiniteContainerByThisAmount = this.thirdRowElement.offsetTop - this.thirdRowElementOldOffsetTop;
      infiniteContainer.scrollTop = infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
    }
  },

  componentWillMount: function (argument) {
    this.alreadyPreparedRows = {};
    this.prepareVisibleRows(this.state.preloadRowStart);
  },

  componentDidMount: function (argument) {
    //tnr, instead of finding the dom nodes and performing calculations, we can add 
    //a variable to the state/props to determine if we need to scroll down
    var infiniteContainer = React.findDOMNode(this.refs.infiniteContainer);
    // var heightOfTopSpacer = React.findDOMNode(this.refs.topSpacer).scrollHeight;
    // if (heightOfTopSpacer > 0) {
      var thirdRowElement = infiniteContainer.children[2].scrollIntoView();
    // }
  },

  prepareVisibleRows: function (rowStart) {
    if (!arePositiveIntegers(rowStart)) {
      return;
      console.warn('non-integer value passed to prepareVisibleRows');
    }
    var rowsThatFitIntoViewport = Math.ceil(this.state.viewportDimensions.height / this.state.averageRowHeight);

    // console.log('rowsThatFitIntoViewport');
    // console.log(rowsThatFitIntoViewport);
    var numberOfRowsToDisplay = rowsThatFitIntoViewport + 5;

    var preloadRowEnd = (rowStart + numberOfRowsToDisplay) < this.state.rowData.length ? (rowStart + numberOfRowsToDisplay) : this.state.rowData.length; 

    var visibleRows = this.state.rowData.slice(rowStart,preloadRowEnd);
    this.setState({
      preloadRowStart: rowStart,
      visibleRows: visibleRows,
    });
  },

  handleScrollbarDrag: function(event, ui) {
    var rowStart = Math.ceil(ui.position.top * this.state.rowData.length / this.state.viewportDimensions.height);
    // console.log('rowStart just calculated :' + rowStart);
    this.prepareVisibleRows(rowStart);
  },
  handleScrollbarDragStart: function(event, ui) {
    this.scollerBeingDragged = true;
  },

  handleScrollbarDragStop: function(event, ui) {
    this.scollerBeingDragged = false;
  },

  handleEditorDrag: function(event, ui) {
    console.log('editorDrag');
    // event.offsetX
    // event.offsetY
    var infiniteContainer = this.refs.infiniteContainer.getDOMNode();


    for (var i = 0; i < infiniteContainer.childNodes.length; i++) {
      var row = infiniteContainer.childNodes[i];
      console.log('node.offsetX: ' + row);
      // console.log('node.offsetY: ' + node.offsetY);
    }
  },
  handleEditorDragStart: function(event, ui) {
    this.editorBeingDragged = true;
  },

  handleEditorDragStop: function(event, ui) {
    this.editorBeingDragged = false;
  },

  render: function () {
    var self = this;
    var rowItems = this.state.visibleRows.map(function(row) {
      if (row) {
        return(<RowItem key={row.rowNumber} row={row} rowLength={self.state.rowLength}  />);
      }
    });

    var infiniteContainerStyle = {
      height: this.state.viewportDimensions.height,
      width: this.state.viewportDimensions.width,
      overflowY: "scroll",
      float: "left",
      paddingRight: "20px"
    };
    var scrollbarStyle = {
      height: this.state.viewportDimensions.height,
      width: 15,
      top: 0,
      right: 0,
      position:"absolute",
    };
    var scrollerStyle = {
      height: 50,
      background: "black",
      width: "100%",
      position: "absolute",
      top: 0,
    };

    var moveOnStartChange;
    if (this.scollerBeingDragged) {
      console.log('scollerBeingDragged');
      moveOnStartChange = false; //set this to false because the user is dragging
      // this.newStart = 0;
      // scrollerStyle.top = this.initialTopOfScoller
    } else {
      console.log('newStart');
      moveOnStartChange = true; //set to true because user is scrolling (without dragging), and we want the scrollbar position to update
      this.newStart = scrollbarStyle.height*(this.state.preloadRowStart/this.state.rowData.length);
      // console.log('scrollerStyle.top:  ' + scrollerStyle.top);
    }
    console.log('this.newStart:  ' + this.newStart);
    return (
      <div style={{width: infiniteContainerStyle.width + scrollbarStyle.width, position: "relative"}}>
        <Draggable 
            zIndex={100} 
            bounds="parent"
            onDrag={this.handleEditorDrag} 
            onStart={this.handleEditorDragStart} 
            onStop={this.handleEditorDragStop} 
            >
          <div style={{width: infiniteContainerStyle.width, overflowX:"hidden"}}>
            <div ref="infiniteContainer" className="infiniteContainer" style={infiniteContainerStyle} onScroll={this.onScroll}>
                {rowItems}
            </div>
          </div>
        </Draggable>
        <div ref="infiniteContainer-scrollbar" className="infiniteContainer-scrollbar" style={scrollbarStyle}>
          <Draggable 
            axis="y" 
            zIndex={100} 
            bounds="parent"
            start={{y: this.newStart}}
            moveOnStartChange={moveOnStartChange}
            onDrag={this.handleScrollbarDrag} 
            onStart={this.handleScrollbarDragStart} 
            onStop={this.handleScrollbarDragStop} 
            >
            <div ref="scroller" style={scrollerStyle}>
            </div>
          </Draggable>
        </div>
      </div>
    );
  }
});
            // <div ref="topSpacer" className="topSpacer" style={{height: this.state.topSpacerHeight}}/>
            // <div ref="bottomSpacer" className="bottomSpacer" style={{height: this.state.bottomSpacerHeight}}/> 

module.exports = RowView;
