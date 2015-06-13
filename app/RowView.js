var React = require('react');
var Draggable = require('react-draggable');
var RowItem = require('./RowItem');
var appActions = require('./actions/appActions');
var arePositiveIntegers = require('./arePositiveIntegers');
// var InfiniteScrollContainer = require('./InfiniteScrollContainer');
// var prepareRowData = require('./prepareRowData');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;
// var ReactList = require('react-list');
var baobabBranch = require('baobab-react/mixins').branch;
// MoustrapMixin = require('./MoustrapMixin.js');

var RowView = React.createClass({
  mixins: [baobabBranch],
  // mixins: [baobabBranch],

    
  cursors: {
    // visibilityParameters: ['vectorEditorState', 'visibilityParameters'],
    CHAR_WIDTH: ['vectorEditorState', 'CHAR_WIDTH'],
    preloadRowStart: ['vectorEditorState', 'preloadRowStart'],
    averageRowHeight: ['vectorEditorState', 'averageRowHeight'],
    viewportDimensions: ['vectorEditorState', 'viewportDimensions'],
    preloadBasepairStart: ['vectorEditorState', 'preloadBasepairStart'],
    selectionLayer: ['vectorEditorState', 'selectionLayer'],
    // caretPosition: ['vectorEditorState', 'caretPosition'],
  },
  facets: {
    visibleRowsData: 'visibleRowsData',
    // rowData: 'rowData',
    totalRows: 'totalRows'
  },
  // keybindings: {
  //   '⌘S': function() {
  //     console.log('save!');
  //     event.preventDefault();
  //   },
  //   '⌘C': 'COPY',
  //   'T': function() {
  //     this.insertSequenceString('t');
  //   },
  // },
  // keybinding: function(event, action) {
  //   debugger;
  //   // event is the browser event, action is 'COPY'
  //   console.log(arguments);
  // },
  

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
  onEditorScroll: function (event) {
    //tnr: we should maybe keep this implemented..
    // if (this.adjustmentScroll) {
    //   console.log('adjustmentScroll');
    //   //adjustment scrolls are called in componentDidUpdate where we manually set the scrollTop (which inadvertantly triggers a scroll)
    //   this.adjustmentScroll = false;
    //   return true;
    // }

    var infiniteContainer = event.currentTarget;
    var visibleRowsContainer = React.findDOMNode(this.refs.visibleRowsContainer);
    var currentAverageRowHeight = (visibleRowsContainer.getBoundingClientRect().height/this.state.visibleRowsData.length);
    // var firstRow = visibleRowsContainer.childNodes[0]; 
    // var lastRow = visibleRowsContainer.childNodes[visibleRowsContainer.childNodes.length-1]; 
    // console.log('infiniteContainer.getBoundingClientRect().top:    ' + infiniteContainer.getBoundingClientRect().top + '       infiniteContainer.getBoundingClientRect().bottom: ' + infiniteContainer.getBoundingClientRect().bottom);
    // console.log('visibleRowsContainer.getBoundingClientRect().top: ' + visibleRowsContainer.getBoundingClientRect().top + ' visibleRowsContainer.getBoundingClientRect().bottom: ' + visibleRowsContainer.getBoundingClientRect().bottom);
    // if (infiniteContainer.getBoundingClientRect())
    var newRowStart;
    // console.log(infiniteContainer.scrollTop);
    var distanceFromTopOfVisibleRows = infiniteContainer.getBoundingClientRect().top - visibleRowsContainer.getBoundingClientRect().top;
    var distanceFromBottomOfVisibleRows = visibleRowsContainer.getBoundingClientRect().bottom - infiniteContainer.getBoundingClientRect().bottom;
    // console.log('distanceFromTopOfVisibleRows: ' + distanceFromTopOfVisibleRows);
    // console.log('distanceFromBottomOfVisibleRows: ' + distanceFromBottomOfVisibleRows);
    if (distanceFromTopOfVisibleRows < 0) {
      //scrolling down, so add a row below
      if (this.rowStart > 0) {
        newRowStart = this.rowStart - Math.ceil(-1 * distanceFromTopOfVisibleRows/currentAverageRowHeight);
        // console.log('newRowStart: '+newRowStart)

        if (newRowStart < 0) newRowStart = 0;
        // console.log('//scrolling up, so add a row above');
        this.prepareVisibleRows(newRowStart);
      }
    } 
    else if (distanceFromBottomOfVisibleRows < 0) {
      var rowsToGiveOnBottom = this.state.totalRows - 1 - this.preloadRowEnd;
      if (rowsToGiveOnBottom > 0) {
        newRowStart = this.rowStart + Math.ceil(-1*distanceFromBottomOfVisibleRows/currentAverageRowHeight);
        if (newRowStart + this.state.visibleRowsData.length >= this.state.totalRows) {
          //the new row start is too high, so we instead just append the max rowsToGiveOnBottom to our current preloadRowStart
          newRowStart = this.rowStart + rowsToGiveOnBottom; 
        }
        this.prepareVisibleRows(newRowStart);
        // console.log('//scrolling down, so add a row below');
      }
    } else {
      //we haven't scrolled enough, so do nothing
    }
    //set the averageRowHeight to the currentAverageRowHeight
    // appActions.setAverageRowHeight(currentAverageRowHeight);

  },

  componentWillUpdate: function(argument) {
    //save a reference to the thirdRowElement and its offset from the top of the container (if it exists)
    var visibleRowsContainer = React.findDOMNode(this.refs.visibleRowsContainer);
    this.thirdRowElement = visibleRowsContainer.children[2];
    if (this.thirdRowElement) {
      this.thirdRowElementOldOffsetTop = this.thirdRowElement.getBoundingClientRect().top;
      console.log('this.thirdRowElementOldOffsetTop: ' + this.thirdRowElementOldOffsetTop);
    }
    //   this.updateTriggeredByScrollerDrag = true;
    // } else {
    //   this.updateTriggeredByScrollerDrag = false;
    // }
  },

  componentDidUpdate: function(argument) {
    var infiniteContainer = React.findDOMNode(this.refs.infiniteContainer);
    var visibleRowsContainer = React.findDOMNode(this.refs.visibleRowsContainer);

    if (!visibleRowsContainer.childNodes[0]) {
      //there aren't any rows yet
      console.log('return early');
      return; 
    }
    var firstRowHeight = visibleRowsContainer.childNodes[0].getBoundingClientRect().height; 
    var lastRowHeight = visibleRowsContainer.childNodes[visibleRowsContainer.childNodes.length-1].getBoundingClientRect().height; 
    var adjustInfiniteContainerByThisAmount;
    
    // console.log('infiniteContainer.getBoundingClientRect().top:    ' + infiniteContainer.getBoundingClientRect().top + '       infiniteContainer.getBoundingClientRect().bottom: ' + infiniteContainer.getBoundingClientRect().bottom);
    // console.log('visibleRowsContainer.getBoundingClientRect().top: ' + visibleRowsContainer.getBoundingClientRect().top + ' visibleRowsContainer.getBoundingClientRect().bottom: ' + visibleRowsContainer.getBoundingClientRect().bottom);
    //check if the visible rows fill up the viewport
    if (visibleRowsContainer.getBoundingClientRect().height - 1.5*(firstRowHeight + lastRowHeight) <= this.state.viewportDimensions.height) {
      if (this.rowStart + this.numberOfRowsToDisplay < this.state.totalRows) {
        //load another row to the bottom
        this.prepareVisibleRows(this.rowStart, this.numberOfRowsToDisplay+1);
      } else {
        //there aren't more rows that we can load at the bottom so we load more at the top
        this.prepareVisibleRows(this.rowStart - 1, this.numberOfRowsToDisplay);  
      }
    } else if (false) {
      //maybe put logic in here to reshrink the number of rows to display... maybe...

    //check if the visible container
    } else if (visibleRowsContainer.getBoundingClientRect().top > infiniteContainer.getBoundingClientRect().top) {
      //scroll to align the tops of the boxes
      adjustInfiniteContainerByThisAmount = visibleRowsContainer.getBoundingClientRect().top - infiniteContainer.getBoundingClientRect().top;
      console.log('!@#!@#!@#!@#!@#!@#!@#adjustInfiniteContainerByThisAmountTop: '+adjustInfiniteContainerByThisAmount)
      this.adjustmentScroll = true;
      infiniteContainer.scrollTop = infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
    } else if (visibleRowsContainer.getBoundingClientRect().bottom < infiniteContainer.getBoundingClientRect().bottom) {
      //scroll to align the bottoms of the boxes
      adjustInfiniteContainerByThisAmount = visibleRowsContainer.getBoundingClientRect().bottom - infiniteContainer.getBoundingClientRect().bottom;
      console.log('!@#!@#!@#!@#!@#!@#!@#adjustInfiniteContainerByThisAmountBottom: '+adjustInfiniteContainerByThisAmount)
      this.adjustmentScroll = true;
      infiniteContainer.scrollTop = infiniteContainer.scrollTop - adjustInfiniteContainerByThisAmount;
    } else {
      if (this.thirdRowElement) {
        // console.log('thirdrowblind');
        // adjustInfiniteContainerByThisAmount = visibleRowsContainer.getBoundingClientRect().bottom - infiniteContainer.getBoundingClientRect().bottom;
        // console.log('adjust: ' + adjustInfiniteContainerByThisAmount)
        // console.log('thirdRowElement Found');
        //there is a thirdRowElement, so we want to make sure its screen position hasn't changed
        this.adjustmentScroll = true;
        adjustInfiniteContainerByThisAmount = this.thirdRowElement.getBoundingClientRect().top - this.thirdRowElementOldOffsetTop;
        console.log('adjustInfiniteContainerByThisAmount: ' + adjustInfiniteContainerByThisAmount)
        infiniteContainer.scrollTop = infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
        // this.adjustmentScroll = true
      }
    }
    
  },

  componentWillMount: function (argument) {
    //this is the only place where we use preloadRowStart
    if (arePositiveIntegers(this.state.preloadRowStart) && this.state.preloadRowStart<this.state.totalRows) {
      this.prepareVisibleRows(this.state.preloadRowStart);
    } else {
      this.prepareVisibleRows(0);
    }
  },

  componentDidMount: function (argument) {
    //call componentDidUpdate so that the scroll position will be adjusted properly 
    //(we may load a random row in the middle of the sequence and not have the infinte container scrolled properly initially, so we scroll to the show the rowContainer)
    this.componentDidUpdate();
    

  },

  prepareVisibleRows: function (rowStart, newNumberOfRowsToDisplay) { //note, rowEnd is optional
    if (!arePositiveIntegers(rowStart)) {
      return;
      console.warn('non-integer value passed to prepareVisibleRows');
    }

    if (arePositiveIntegers(newNumberOfRowsToDisplay)){
      this.numberOfRowsToDisplay = newNumberOfRowsToDisplay;
    } 
    if (!this.numberOfRowsToDisplay) {
      // var rowsThatFitIntoViewport = Math.ceil(this.state.viewportDimensions.height / this.state.averageRowHeight);

      // // console.log('rowsThatFitIntoViewport');
      // // console.log(rowsThatFitIntoViewport);
      this.numberOfRowsToDisplay = 4;
    }
    this.preloadRowEnd = (rowStart + this.numberOfRowsToDisplay) > this.state.totalRows - 1 ? this.state.totalRows - 1: (rowStart + this.numberOfRowsToDisplay);
    console.log('this.preloadRowEnd: ' + this.preloadRowEnd);
    // var visibleRows = this.state.visibleRowsDataData.slice(rowStart, this.preloadRowEnd + 1);
    // rowData.slice(rowStart, this.preloadRowEnd + 1);
    // appActions.setPreloadRowStart(rowStart);
    this.rowStart = rowStart;
    appActions.setVisibleRows({
      start: rowStart,
      end: this.preloadRowEnd + 1
    });

    // if (this.preloadRowEnd this.state.numberOfRowsToPreload)
  },

  getNearestCursorPositionToMouseEvent: function(event) {
    var rowNotFound = true;
    var visibleRowsContainer = this.refs.visibleRowsContainer.getDOMNode();
    //loop through all the rendered rows to see if the click event lands in one of them
    for (var relativeRowNumber = 0; relativeRowNumber < visibleRowsContainer.childNodes.length; relativeRowNumber++) {
      var rowDomNode = visibleRowsContainer.childNodes[relativeRowNumber];
      // console.log('rowDomNode.getBoundingClientRect().top: ' + rowDomNode.getBoundingClientRect().top);
      var boundingRowRect = rowDomNode.getBoundingClientRect();
      if (event.clientY > boundingRowRect.top && event.clientY < boundingRowRect.top + boundingRowRect.height) {
        //then the click is falls within this row
        rowNotFound = false;
        var row = this.state.visibleRowsData[relativeRowNumber];
        if (event.clientX - boundingRowRect.left < 0) {
          console.warn('this should never be 0...');
          return row.start; //return the first bp in the row
        } else {
          var clickXPositionRelativeToRowContainer = event.clientX - boundingRowRect.left;
          var numberOfBPsInFromRowStart = Math.floor((clickXPositionRelativeToRowContainer + CHAR_WIDTH/2) / CHAR_WIDTH);
          var nearestBP = numberOfBPsInFromRowStart + row.start;
          if (nearestBP > row.end + 1) {
            nearestBP = row.end + 1;
          }
          return nearestBP;
        }
        break; //break the for loop early because we found the row the click event landed in
      }
    }
    if (rowNotFound) {
      console.warn('was not able to find the correct row');
      //return the last bp index in the rendered rows
      var lastOfRenderedRows = this.state.visibleRowsData[this.state.visibleRowsData.length - 1];
      return lastOfRenderedRows.end;
    }
  },

  onEditorClick: function(event) {
    //if cursor position is different than the original position, reset the position and clear the selection
    console.log('onclick!!');
    var bp = this.getNearestCursorPositionToMouseEvent(event);
    if (this.editorBeingDragged) {
      //do nothing because the click was triggered by a drag event
    } else {
      appActions.setCursorPosition(bp);
      appActions.setSelectionLayer(false);
    }

    // console.log('bp: ' + bp);
  }, 

  handleEditorDrag: function(event, ui) {
    // console.log('dragging!');
    this.editorBeingDragged = true;
    var caretPositionOfDrag = this.getNearestCursorPositionToMouseEvent(event);
    var start;
    var end;
    if (caretPositionOfDrag === this.fixedCursorPositionOnEditorDrag) {
      appActions.setCursorPosition(caretPositionOfDrag);
      appActions.setSelectionLayer(false);
    } else {
      if (caretPositionOfDrag>this.fixedCursorPositionOnEditorDrag) {
        start = this.fixedCursorPositionOnEditorDrag;
        end = caretPositionOfDrag - 1;
      } else {
        start = caretPositionOfDrag;
        end = this.fixedCursorPositionOnEditorDrag - 1;
        // console.log('this.state.selectionLayer.sequenceSelected '+this.state.selectionLayer.sequenceSelected)
      }
      appActions.setSelectionLayer(start, end);
      appActions.setCursorPosition(-1);
    }
  },

  handleEditorDragStart: function(event, ui) {
    // console.log('drag start!');
    // console.log('event: ' + event.target);
    var caretPosition = this.getNearestCursorPositionToMouseEvent(event);
    if (event.target.className === "cursor" && this.state.selectionLayer.sequenceSelected) {
      if (this.state.selectionLayer.start === caretPosition) {
        this.fixedCursorPositionOnEditorDrag = this.state.selectionLayer.end + 1; 
        //plus one because the cursor position will be 1 more than the selectionLayer.end
        //imagine selection from 
        //0 1 2  <--possible cursor positions
        // A T G 
        //if A is selected, selection.start = 0, selection.end = 0
        //so the caretPosition for the end of the selection is 1! 
        //which is selection.end+1
      } else {
        this.fixedCursorPositionOnEditorDrag = this.state.selectionLayer.start;
      }
    } else {
      this.fixedCursorPositionOnEditorDrag = caretPosition;
      // console.log('caretPosition '+caretPosition)
    }
  },

  handleEditorDragStop: function(event, ui) {
    var self = this;
    if (this.editorBeingDragged) { //check to make sure dragging actually occurred 
      setTimeout(function (argument) { 
        //we use setTimeout to put the call to change editorBeingDragged to false
        //on the bottom of the event stack, thus the click event that is fired because of the drag
        //will be able to check if editorBeingDragged and not trigger if it is
        self.editorBeingDragged = false;
      },0);
    } else {
      self.editorBeingDragged = false;
    }
  },

  render: function () {
    console.log('render!');
    var self = this;
    var rowItems = this.state.visibleRowsData.map(function(row) {
      if (row) {
        return(<RowItem key={row.rowNumber} row={row} />);
      }
    });

    var rowHeight = this.currentAverageRowHeight ? this.currentAverageRowHeight : this.state.averageRowHeight;
    this.topSpacerHeight = this.rowStart * rowHeight;
    this.bottomSpacerHeight = (this.state.totalRows - 1 - this.preloadRowEnd) * rowHeight;

    var infiniteContainerStyle = {
      height: this.state.viewportDimensions.height,
      width: this.state.viewportDimensions.width,
      overflowY: "scroll",
      // float: "left",
      // paddingRight: "20px"
      padding: 10
    };
    return (
        <Draggable 
            bounds={{top: 0, left: 0, right: 0, bottom: 0}}
            onDrag={this.handleEditorDrag} 
            onStart={this.handleEditorDragStart} 
            onStop={this.handleEditorDragStop} 
            >
          <div
            ref="infiniteContainer" 
            className="infiniteContainer" 
            style={infiniteContainerStyle} 
            onScroll={this.onEditorScroll}
            onClick={this.onEditorClick}
            >
              <div ref="topSpacer" className="topSpacer" style={{height: this.topSpacerHeight}}/>
              <div ref="visibleRowsContainer" className="visibleRowsContainer">
                {rowItems}
              </div>
              <div ref="bottomSpacer" className="bottomSpacer" style={{height: this.bottomSpacerHeight}}/> 
          </div>
        </Draggable>
    );
  }
});

module.exports = RowView;
