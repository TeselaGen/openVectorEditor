var ObjectID = require("bson-objectid");
var React = require('react');
var Draggable = require('react-draggable');
var RowItem = require('./RowItem.js');
var appActions = require('./actions/appActions');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
// var InfiniteScrollContainer = require('./InfiniteScrollContainer');
// var prepareRowData = require('./prepareRowData');
var charWidth = require('./editorConstants').charWidth;
// var ReactList = require('react-list');
var baobabBranch = require('baobab-react/mixins').branch;
// MoustrapMixin = require('./MoustrapMixin.js');

var RowView = React.createClass({
  mixins: [baobabBranch],
  // mixins: [baobabBranch],


  cursors: {
    // visibilityParameters: ['vectorEditorState', 'visibilityParameters'],
    charWidth: ['vectorEditorState', 'charWidth'],
    preloadRowStart: ['vectorEditorState', 'preloadRowStart'],
    averageRowHeight: ['vectorEditorState', 'averageRowHeight'],
    viewportDimensions: ['vectorEditorState', 'viewportDimensions'],
    preloadBasepairStart: ['vectorEditorState', 'preloadBasepairStart'],
    selectionLayer: ['vectorEditorState', 'selectionLayer'],
    // caretPosition: ['vectorEditorState', 'caretPosition'],
    visibleRowsData: ['$visibleRowsData'],
    // rowData: 'rowData',
    totalRows: ['$totalRows']
  },
  // keybindings: {
  //   '⌘S': function() {
  //     event.preventDefault();
  //   },
  //   '⌘C': 'COPY',
  //   'T': function() {
  //     this.insertSequenceString('t');
  //   },
  // },
  // keybinding: function(event, action) {
  //   // event is the browser event, action is 'COPY'
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
    //   //adjustment scrolls are called in componentDidUpdate where we manually set the scrollTop (which inadvertantly triggers a scroll)
    //   this.adjustmentScroll = false;
    //   return true;
    // }

    var infiniteContainer = event.currentTarget;
    var visibleRowsContainer = React.findDOMNode(this.refs.visibleRowsContainer);
    var currentAverageRowHeight = (visibleRowsContainer.getBoundingClientRect().height/this.state.visibleRowsData.length);
    // var firstRow = visibleRowsContainer.childNodes[0];
    // var lastRow = visibleRowsContainer.childNodes[visibleRowsContainer.childNodes.length-1];
    // if (infiniteContainer.getBoundingClientRect())
    var newRowStart;
    var distanceFromTopOfVisibleRows = infiniteContainer.getBoundingClientRect().top - visibleRowsContainer.getBoundingClientRect().top;
    var distanceFromBottomOfVisibleRows = visibleRowsContainer.getBoundingClientRect().bottom - infiniteContainer.getBoundingClientRect().bottom;
    if (distanceFromTopOfVisibleRows < 0) {
      //scrolling down, so add a row below
      if (this.rowStart > 0) {
        newRowStart = this.rowStart - Math.ceil(-1 * distanceFromTopOfVisibleRows/currentAverageRowHeight);

        if (newRowStart < 0) newRowStart = 0;
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
      // console.log('this.thirdRowElementOldOffsetTop: ' + this.thirdRowElementOldOffsetTop);
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
      throw 'no visible rows!!';
    }
    var firstRowHeight = visibleRowsContainer.childNodes[0].getBoundingClientRect().height;
    var lastRowHeight = visibleRowsContainer.childNodes[visibleRowsContainer.childNodes.length-1].getBoundingClientRect().height;
    var adjustInfiniteContainerByThisAmount;

    //check if the visible rows fill up the viewport
    var v = visibleRowsContainer.getBoundingClientRect();
    var t = infiniteContainer.getBoundingClientRect();
    // console.log('visibleRowsContainer.getBoundingClientRect(): ', 'top', v.top, 'bottom', v.bottom, 'height', v.height);
    // console.log('firstRowHeight', firstRowHeight);
    // console.log('lastRowHeight', lastRowHeight);
    // console.log('infiniteContainer.scrollTop: ' + infiniteContainer.scrollTop);
    // console.log('infiniteContainer.getBoundingClientRect(): ', 'top', t.top, 'bottom', t.bottom, 'height', t.height);

    if (visibleRowsContainer.getBoundingClientRect().height - 1.5*(firstRowHeight + lastRowHeight) <= this.state.viewportDimensions.height) {
      // console.log('HEEEEEteteteEEEEEEET');
      if (this.rowStart + this.numberOfRowsToDisplay < this.state.totalRows) {
        //load another row to the bottom
        // console.log('add row to bottom');
        this.prepareVisibleRows(this.rowStart, this.numberOfRowsToDisplay+1);
      } else {
        // console.log('add row above');
        //there aren't more rows that we can load at the bottom so we load more at the top
        if (this.rowStart - 1 > 0) {
          this.prepareVisibleRows(this.rowStart - 1, this.numberOfRowsToDisplay);
        } else {
          this.prepareVisibleRows(0, this.numberOfRowsToDisplay);
        }
      }
    } else if (false) {
      //maybe put logic in here to reshrink the number of rows to display... maybe...
    //check if the visible container
    } else if (visibleRowsContainer.getBoundingClientRect().top > infiniteContainer.getBoundingClientRect().top) {
      //scroll to align the tops of the boxes
      adjustInfiniteContainerByThisAmount = visibleRowsContainer.getBoundingClientRect().top - infiniteContainer.getBoundingClientRect().top;
      // console.log('!@#!@#!@#!@#!@#!@#!@#adjustInfiniteContainerByThisAmountTop: '+adjustInfiniteContainerByThisAmount)
      this.adjustmentScroll = true;
      infiniteContainer.scrollTop = infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
    } else if (visibleRowsContainer.getBoundingClientRect().bottom < infiniteContainer.getBoundingClientRect().bottom) {
      //scroll to align the bottoms of the boxes
      adjustInfiniteContainerByThisAmount = visibleRowsContainer.getBoundingClientRect().bottom - infiniteContainer.getBoundingClientRect().bottom;
      // console.log('!@#!@#!@#!@#!@#!@#!@#adjustInfiniteContainerByThisAmountBottom: '+adjustInfiniteContainerByThisAmount)
      this.adjustmentScroll = true;
      infiniteContainer.scrollTop = infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
    } else {
      if (this.thirdRowElement) {
        // adjustInfiniteContainerByThisAmount = visibleRowsContainer.getBoundingClientRect().bottom - infiniteContainer.getBoundingClientRect().bottom;
        //there is a thirdRowElement, so we want to make sure its screen position hasn't changed
        this.adjustmentScroll = true;
        adjustInfiniteContainerByThisAmount = this.thirdRowElement.getBoundingClientRect().top - this.thirdRowElementOldOffsetTop;
        // console.log('adjustInfiniteContainerByThisAmount: ' + adjustInfiniteContainerByThisAmount)
        infiniteContainer.scrollTop = infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
      }
    }
      // console.log('infiniteContainer.scrollTop2: ' + infiniteContainer.scrollTop);


  },

  componentWillMount: function (argument) {
    //this is the only place where we use preloadRowStart
    if (areNonNegativeIntegers([this.state.preloadRowStart]) && this.state.preloadRowStart<this.state.totalRows) {
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
    if (!areNonNegativeIntegers([rowStart])) {
      return;
      console.warn('non-integer value passed to prepareVisibleRows');
    }

    if (areNonNegativeIntegers([newNumberOfRowsToDisplay])){
      this.numberOfRowsToDisplay = newNumberOfRowsToDisplay;
    }
    if (!this.numberOfRowsToDisplay) {
      // var rowsThatFitIntoViewport = Math.ceil(this.state.viewportDimensions.height / this.state.averageRowHeight);
      this.numberOfRowsToDisplay = 4;
    }
    if (rowStart + this.numberOfRowsToDisplay - 1 > this.state.totalRows - 1 ) {
      this.preloadRowEnd = this.state.totalRows - 1;
    } else {
      this.preloadRowEnd = rowStart + this.numberOfRowsToDisplay - 1;
    }
    // console.log('this.preloadRowEnd: ' + this.preloadRowEnd);
    // var visibleRows = this.state.visibleRowsDataData.slice(rowStart, this.preloadRowEnd + 1);
    // rowData.slice(rowStart, this.preloadRowEnd + 1);
    // appActions.setPreloadRowStart(rowStart);
    this.rowStart = rowStart;
    if (!this.state.visibleRows || (this.state.visibleRows.start !== this.rowStart && this.state.visibleRows.end !== this.preloadRowEnd)) {
      appActions.setVisibleRows({
        start: this.rowStart,
        end: this.preloadRowEnd
      });
    } else {
      // console.log('blocked rerender!');
    }

    // if (this.preloadRowEnd this.state.numberOfRowsToPreload)
  },

  getNearestCursorPositionToMouseEvent: function(event) {
    var rowNotFound = true;
    var visibleRowsContainer = this.refs.visibleRowsContainer.getDOMNode();
    //loop through all the rendered rows to see if the click event lands in one of them
    for (var relativeRowNumber = 0; relativeRowNumber < visibleRowsContainer.childNodes.length; relativeRowNumber++) {
      var rowDomNode = visibleRowsContainer.childNodes[relativeRowNumber];
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
          var numberOfBPsInFromRowStart = Math.floor((clickXPositionRelativeToRowContainer + charWidth/2) / charWidth);
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
    // console.log('onclick!!');
    var bp = this.getNearestCursorPositionToMouseEvent(event);
    if (this.editorBeingDragged) {
      //do nothing because the click was triggered by a drag event
    } else {
      appActions.setCaretPosition(bp);
      appActions.setSelectionLayer(false);
    }

  },

  handleEditorDrag: function(event, ui) {
    //note this method relies on variables that are set in the handleEditorDragStart method!
    this.editorBeingDragged = true;
    var caretPositionOfDrag = this.getNearestCursorPositionToMouseEvent(event);
    var start;
    var end;
    if (caretPositionOfDrag === this.fixedCaretPositionOnEditorDragStart) {
      appActions.setCaretPosition(caretPositionOfDrag);
      appActions.setSelectionLayer(false);
    } else {
      var newSelectionLayer;
      if (this.fixedCaretPositionOnEditorDragStartType === 'start') {
        newSelectionLayer = {
          start: this.fixedCaretPositionOnEditorDragStart,
          end: caretPositionOfDrag - 1,
          cursorAtEnd: true,
        };
      } else if (this.fixedCaretPositionOnEditorDragStartType === 'end') {
        newSelectionLayer = {
          start: caretPositionOfDrag,
          end: this.fixedCaretPositionOnEditorDragStart - 1,
          cursorAtEnd: false,
        };
      } else {
        if (caretPositionOfDrag > this.fixedCaretPositionOnEditorDragStart) {
          newSelectionLayer = {
            start: this.fixedCaretPositionOnEditorDragStart,
            end: caretPositionOfDrag - 1,
            cursorAtEnd: true,
          };
        } else {
          newSelectionLayer = {
            start: caretPositionOfDrag,
            end: this.fixedCaretPositionOnEditorDragStart - 1,
            cursorAtEnd: false,
          };
        }
      }
      appActions.setSelectionLayer(newSelectionLayer);
    }
  },

  handleEditorDragStart: function(event, ui) {
    var caretPosition = this.getNearestCursorPositionToMouseEvent(event);
    if (event.target.className === "cursor" && this.state.selectionLayer.selected) {
      // this.circularSelectionOnEditorDragStart = (this.state.selectionLayer.start > this.state.selectionLayer.end);
      if (this.state.selectionLayer.start === caretPosition) {
        this.fixedCaretPositionOnEditorDragStart = this.state.selectionLayer.end + 1;
        this.fixedCaretPositionOnEditorDragStartType = 'end';

        //plus one because the cursor position will be 1 more than the selectionLayer.end
        //imagine selection from
        //0 1 2  <--possible cursor positions
        // A T G
        //if A is selected, selection.start = 0, selection.end = 0
        //so the caretPosition for the end of the selection is 1!
        //which is selection.end+1
      } else {
        this.fixedCaretPositionOnEditorDragStart = this.state.selectionLayer.start;
        this.fixedCaretPositionOnEditorDragStartType = 'start';
      }
    } else {
      // this.circularSelectionOnEditorDragStart = false;
      this.fixedCaretPositionOnEditorDragStart = caretPosition;
      this.fixedCaretPositionOnEditorDragStartType = 'caret';
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
    // console.log('render!');
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
