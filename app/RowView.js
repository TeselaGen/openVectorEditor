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
    viewportDimensions: ['vectorEditorState', 'viewportDimensions'],
    preloadBasepairStart: ['vectorEditorState', 'preloadBasepairStart'],
    selectionLayer: ['vectorEditorState', 'selectionLayer'],
    cursorPosition: ['vectorEditorState', 'cursorPosition'],
  },
  facets: {
    rowData: 'rowData',
    totalRows: 'totalRows'
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
    var firstRow = infiniteContainer.childNodes[0]; 
    var lastRow = infiniteContainer.childNodes[infiniteContainer.childNodes.length-1]; 
    console.log(infiniteContainer.getBoundingClientRect().bottom);
    console.log(lastRow.getBoundingClientRect().bottom);
    // if (infiniteContainer.getBoundingClientRect())
    
    // console.log(infiniteContainer.scrollTop);
    if ((infiniteContainer.getBoundingClientRect().top - firstRow.getBoundingClientRect().top) === 0) {
      //scrolling down, so add a row below
      if (this.state.preloadRowStart > 0) {
        this.prepareVisibleRows(this.state.preloadRowStart - 1);
      }
      // console.log('//scrolling up, so add a row above');
      this.scrollingUp = true;
    } 
    else if ((infiniteContainer.getBoundingClientRect().bottom - lastRow.getBoundingClientRect().bottom) === 0) {
      if (this.preloadRowEnd < this.state.totalRows) {
        this.prepareVisibleRows(this.state.preloadRowStart + 1);
      // console.log('//scrolling down, so add a row below');
      }
      // this.thirdRowElement = thirdRowElement;
      // this.thirdRowElementScrollHeight = thirdRowElement.scrollHeight;
      this.scrollingUp = false;
    } else {
      //we haven't scrolled enough, so do nothing
      // var infiniteContainerTop = infiniteContainer.getBoundingClientRect().top;
      // infiniteContainer.childNodes.some(function(row, rowIndex) {
      //   if (row.getBoundingClientRect().top - infiniteContainerTop > 0) {
      //     this.setState({topMostFullyVisibleRow: })
      //   }
      // });
    }
    
  },

  componentWillUpdate: function(argument) {
    //save a reference to the thirdRowElement and its offset from the top of the container
    var infiniteContainer = React.findDOMNode(this.refs.infiniteContainer);
    this.thirdRowElement = infiniteContainer.children[2];
    this.thirdRowElementOldOffsetTop = this.thirdRowElement.getBoundingClientRect().top;
    if (this.scollerBeingDragged) {
      this.updateTriggeredByScrollerDrag = true;
    } else {
      this.updateTriggeredByScrollerDrag = false;
    }
  },

  componentDidUpdate: function(argument) {
    var infiniteContainer = React.findDOMNode(this.refs.infiniteContainer);
    
    //if there is no thirdRowElement, we've probably scrolled too far away
    if (this.updateTriggeredByScrollerDrag) {

    } else {
      console.log('hit!');
      if (this.thirdRowElement) { 
        // console.log('thirdRowElement Found');
        //there is a thirdRowElement, so we want to make sure its screen position hasn't changed
        var infiniteContainer = React.findDOMNode(this.refs.infiniteContainer);
        var adjustInfiniteContainerByThisAmount = this.thirdRowElement.getBoundingClientRect().top - this.thirdRowElementOldOffsetTop;
        infiniteContainer.scrollTop = infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
      }
    }
    console.log('infiniteContainer.clientHeight: ' + infiniteContainer.clientHeight);
    console.log('this.state.viewportDimensions.height: ' + this.state.viewportDimensions.height);
    var bottomOfInfiniteContainer = infiniteContainer.getBoundingClientRect().bottom;
    var bottomOfLastRow = infiniteContainer.children[infiniteContainer.children.length-1].getBoundingClientRect().bottom;
    var bottomOfThirdRow = infiniteContainer.children[3].getBoundingClientRect().bottom;
    console.log('bottomOfLastRow: ' + bottomOfLastRow);
    console.log('bottomOfInfiniteContainer: ' + bottomOfInfiniteContainer);
    // debugger;
    if (bottomOfLastRow - bottomOfThirdRow <= bottomOfInfiniteContainer) {
      console.log('//we need to add another row below!');
      console.log('this.preloadRowEnd:'+this.preloadRowEnd);
      this.prepareVisibleRows(this.state.preloadRowStart, this.numberOfRowsToDisplay+1);
    }
  },

  componentWillMount: function (argument) {
    this.alreadyPreparedRows = {};
    this.prepareVisibleRows(this.state.preloadRowStart);
  },

  componentDidMount: function (argument) {
    this.componentDidUpdate();
    // //tnr, instead of finding the dom nodes and performing calculations, we can add 
    // //a variable to the state/props to determine if we need to scroll down
    // var infiniteContainer = React.findDOMNode(this.refs.infiniteContainer);
    // console.log('infiniteContainer.clientHeight: ' + infiniteContainer.clientHeight);
    // console.log('this.state.viewportDimensions.height: ' + this.state.viewportDimensions.height);
    // if (infiniteContainer.clientHeight < this.state.viewportDimensions.height) {
    //   //we need to add another row below!
    //   console.log('this.preloadRowEnd:'+this.preloadRowEnd);
    //   this.prepareVisibleRows(this.state.preloadRowStart, this.preloadRowEnd++);
    // }
    // // var heightOfTopSpacer = React.findDOMNode(this.refs.topSpacer).scrollHeight;
    // // if (heightOfTopSpacer > 0) {
    //   var thirdRowElement = infiniteContainer.children[2].scrollIntoView();
    // // }
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
    this.preloadRowEnd = (rowStart + this.numberOfRowsToDisplay) < this.state.totalRows ? (rowStart + this.numberOfRowsToDisplay) : this.state.totalRows;
    if (this.preloadRowEnd < this.state.totalRows) {
      var visibleRows = this.state.rowData.slice(rowStart, this.preloadRowEnd);
      this.setState({
        preloadRowStart: rowStart,
        visibleRows: visibleRows,
      });
    }

    // if (this.preloadRowEnd this.state.numberOfRowsToPreload)

    
  },

  handleScrollbarDrag: function(event, ui) {
    //the handle should map to an exact scroll position
    //the very top of the drag mapping to the very top of the sequence and same for bottom
    //any given set of row that has been loaded will have a number of positions they can take up
    // var this.initialScrollerTop = this.refs.scroller.getDOMNode().getBoundingClientRect().top;
    console.log('this.initialScrollerTop' + this.initialScrollerTop);
    var infiniteContainerTop = this.refs.infiniteContainer.getDOMNode().getBoundingClientRect().top;
    var distanceFromTop = ui.position.top + this.initialScrollerTop - infiniteContainerTop;
    // var distanceFromTop = ui.position.top + this.initialScrollerTop - infiniteContainerTop;
    console.log('ui.position.top: ' + ui.position.top);
    console.log('distanceFromTop: ' + distanceFromTop);


    var rowStart = Math.floor(distanceFromTop * this.state.totalRows / this.state.viewportDimensions.height);
    // console.log('rowStart just calculated :' + rowStart);
    console.log('rowStart:' + rowStart);
    if (rowStart < 0) {
      //check for a valid rowStart
      rowStart = 0;
    }
    var validBottomRow = rowStart + this.state.visibleRows.length <= this.state.totalRows;
    var newRowToBeLoaded = rowStart !== this.state.preloadRowStart;
    if (validBottomRow && newRowToBeLoaded) {
      // console.log('prepareVisibleRows!');
      
      this.prepareVisibleRows(rowStart);
    } else if (rowStart === 0 || rowStart + this.state.visibleRows.length > this.state.totalRows) {

      // console.log('move smoothly!');
      var infiniteContainer = this.refs.infiniteContainer.getDOMNode();
      
      var totalHeightOfInfiniteContainer = infiniteContainer.clientHeight;
      var averageHeightOfVisibleRows = totalHeightOfInfiniteContainer/this.state.visibleRows.length;
      var incrementToMoveInfinteContainerBy = this.state.totalRows * averageHeightOfVisibleRows / this.state.viewportDimensions.height;
      //user hasn't dragged far enough to get to a new row, so
      //scroll the infinite container down or up a lil bit
      // infiniteContainer.scrollTop / 1;
      // console.log('ui.node.offsetTop ' + ui.node.offsetTop);
      var changeInScrollerPosition = ui.position.top - this.uiPositionTop;
      // console.log('changeInScrollerPosition ' + changeInScrollerPosition);
      this.uiPositionTop = ui.position.top;

      // var adjustInfiniteContainerByThisAmount = changeInScrollerPosition * incrementToMoveInfinteContainerBy;
      var adjustInfiniteContainerByThisAmount = changeInScrollerPosition * this.state.visibleRows.length * totalHeightOfInfiniteContainer / this.state.viewportDimensions.height;
      // console.log('adjustInfiniteContainerByThisAmount:' + adjustInfiniteContainerByThisAmount);
      //bound the 
      infiniteContainer.scrollTop = infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
      console.log('infiniteContainer.scrollTop: ' + infiniteContainer.scrollTop);
    }
  },
  handleScrollbarDragStart: function(event, ui) {
    this.uiPositionTop = ui.position.top;
    this.initialScrollerTop = this.refs.scroller.getDOMNode().getBoundingClientRect().top;
    this.scollerBeingDragged = true;
  },

  handleScrollbarDragStop: function(event, ui) {
    this.scollerBeingDragged = false;
  },

  getNearestCursorPositionToMouseEvent: function(event) {
    var rowNotFound = true;
    var infiniteContainer = this.refs.infiniteContainer.getDOMNode();
    //loop through all the rendered rows to see if the click event lands in one of them
    for (var relativeRowNumber = 0; relativeRowNumber < infiniteContainer.childNodes.length; relativeRowNumber++) {
      var rowDomNode = infiniteContainer.childNodes[relativeRowNumber];
      // console.log('rowDomNode.getBoundingClientRect().top: ' + rowDomNode.getBoundingClientRect().top);
      var boundingRowRect = rowDomNode.getBoundingClientRect();
      if (event.clientY > boundingRowRect.top && event.clientY < boundingRowRect.top + boundingRowRect.height) {
        //then the click is falls within this row
        rowNotFound = false;
        var row = this.state.visibleRows[relativeRowNumber];
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
      var lastOfRenderedRows = this.state.visibleRows[this.state.visibleRows.length - 1];
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
    var cursorPositionOfDrag = this.getNearestCursorPositionToMouseEvent(event);
    var start;
    var end;
    if (cursorPositionOfDrag === this.fixedCursorPositionOnEditorDrag) {
      appActions.setCursorPosition(cursorPositionOfDrag);
      appActions.setSelectionLayer(false);
    } else {
      if (cursorPositionOfDrag>this.fixedCursorPositionOnEditorDrag) {
        start = this.fixedCursorPositionOnEditorDrag;
        end = cursorPositionOfDrag - 1;
      } else {
        start = cursorPositionOfDrag;
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
    var cursorPosition = this.getNearestCursorPositionToMouseEvent(event);
    if (event.target.className === "cursor" && this.state.selectionLayer.sequenceSelected) {
      if (this.state.selectionLayer.start === cursorPosition) {
        this.fixedCursorPositionOnEditorDrag = this.state.selectionLayer.end + 1; 
        //plus one because the cursor position will be 1 more than the selectionLayer.end
        //imagine selection from 
        //0 1 2  <--possible cursor positions
        // A T G 
        //if A is selected, selection.start = 0, selection.end = 0
        //so the cursorPosition for the end of the selection is 1! 
        //which is selection.end+1
      } else {
        this.fixedCursorPositionOnEditorDrag = this.state.selectionLayer.start;
      }
    } else {
      this.fixedCursorPositionOnEditorDrag = cursorPosition;
      // console.log('cursorPosition '+cursorPosition)
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
    var self = this;
    var rowItems = this.state.visibleRows.map(function(row) {
      if (row) {
        return(<RowItem key={row.rowNumber} row={row} />);
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
    var scrollerHeight = infiniteContainerStyle.height / this.state.totalRows;
    if (scrollerHeight < 10) {
      scrollerHeight = 10;
    } else if (scrollerHeight > infiniteContainerStyle.height) {
      scrollerHeight = infiniteContainerStyle.height;
    }
    var scrollerStyle = {
      height: scrollerHeight,
      background: "black",
      width: "100%",
      position: "absolute",
      top: (scrollbarStyle.height - scrollerHeight) * (this.state.preloadRowStart/(this.state.totalRows - this.state.visibleRows.length)),
    };

    // var moveOnStartChange;
    // if (this.scollerBeingDragged) {
    //   // console.log('scollerBeingDragged');
    //   moveOnStartChange = false; //set this to false because the user is dragging
    //   // this.newScrollerStart = 0;
    //   // scrollerStyle.top = this.initialTopOfScoller
    // } else {
      // console.log('newScrollerStart');
      // moveOnStartChange = true; //set to true because user is scrolling (without dragging), and we want the scrollbar position to update
      // this.newScrollerStart = scrollbarStyle.height*(this.state.preloadRowStart/this.state.totalRows);
    // }
    // console.log('this.newScrollerStart:  ' + this.newScrollerStart);
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
            <div 
              ref="infiniteContainer" 
              className="infiniteContainer" 
              style={infiniteContainerStyle} 
              onScroll={this.onScroll}
              onClick={this.onEditorClick}
              >
                {rowItems}
            </div>
          </div>
        </Draggable>

        <div ref="infiniteContainer-scrollbar" className="infiniteContainer-scrollbar" style={scrollbarStyle}>
          <Draggable 
            axis="y" 
            zIndex={100}
            onDrag={this.handleScrollbarDrag} 
            onStart={this.handleScrollbarDragStart} 
            onStop={this.handleScrollbarDragStop} 
            >
            <span>
              <div ref="scroller" style={scrollerStyle}>
              </div>
            </span>
          </Draggable>
        </div>
      </div>
    );
  }
});



            // <div ref="topSpacer" className="topSpacer" style={{height: this.state.topSpacerHeight}}/>
            // <div ref="bottomSpacer" className="bottomSpacer" style={{height: this.state.bottomSpacerHeight}}/> 

module.exports = RowView;
