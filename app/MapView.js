var React = require('react');
var Draggable = require('react-draggable');
var setCaretPosition = require('./actions/setCaretPosition');
var setSelectionLayer = require('./actions/setSelectionLayer');
var baobabBranch = require('baobab-react/mixins').branch;

var RowView = React.createClass({
  mixins: [baobabBranch],
  cursors: {
    preloadRowStart: ['preloadRowStart'],
    averageRowHeight: ['averageRowHeight'],
    rowViewDimensions: ['rowViewDimensions'],
    sequenceData: ['combinedSequenceData'],
    selectionLayer: ['selectionLayer'],
  },
 
  

  onEditorClick: function(event) {
    //if cursor position is different than the original position, reset the position and clear the selection
    // console.log('onclick!!');
    var bp = this.getNearestCursorPositionToMouseEvent(event);
    if (this.editorBeingDragged) {
      //do nothing because the click was triggered by a drag event
    } else {
      setCaretPosition(bp);
      setSelectionLayer(false);
    }

  },

  handleEditorDrag: function(event, ui) {
    //note this method relies on variables that are set in the handleEditorDragStart method!
    this.editorBeingDragged = true;
    var caretPositionOfDrag = this.getNearestCursorPositionToMouseEvent(event);
    var start;
    var end;
    if (caretPositionOfDrag === this.fixedCaretPositionOnEditorDragStart) {
      setCaretPosition(caretPositionOfDrag);
      setSelectionLayer(false);
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
      setSelectionLayer(newSelectionLayer);
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
    return (
        <Draggable
            bounds={{top: 0, left: 0, right: 0, bottom: 0}}
            onDrag={this.handleEditorDrag}
            onStart={this.handleEditorDragStart}
            onStop={this.handleEditorDragStop}
            >
          <div
            ref="mapContainer"
            className="mapContainer"
            onClick={this.onEditorClick}
            >
          </div>
        </Draggable>
    );
  }
});

module.exports = RowView;
