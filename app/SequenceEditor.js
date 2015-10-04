import React, {PropTypes} from 'react';
var Combokeys = require("combokeys");
var combokeys;
var bindGlobalPlugin = require('combokeys/plugins/global-bind');

var RowView = require('./RowView');
var MapView = require('./MapView');

var Clipboard = require('./Clipboard');
import {Decorator as Cerebral} from 'cerebral-react';

@Cerebral({
    sequenceLength: ['sequenceLength'],
    bpsPerRow: ['bpsPerRow'],
    totalRows: ['totalRows'],
    newRandomRowToJumpTo: ['newRandomRowToJumpTo'],
    selectedSequenceString: ['selectedSequenceString'],
    caretPosition: ['caretPosition'],
    sequenceData: ['sequenceData'],
    selectionLayer: ['selectionLayer'],
    clipboardData: ['clipboardData'],
})
class SequenceEditor extends React.Component {
    componentDidMount() {
        var {
            insertSequenceString,
            backspacePressed,
            selectAll,
            moveCaretShortcutFunctions,
        } = this.props.signals;
        combokeys = new Combokeys(document.documentElement);
        // combokeys = new Combokeys(React.findDOMNode(this.refs.sequenceEditor));
        bindGlobalPlugin(combokeys);

        //bind a bunch of keyboard shortcuts we're interested in catching
        //we're using the "mousetrap" library (available thru npm: https://www.npmjs.com/package/br-mousetrap)
        //documentation: https://craig.is/killing/mice
        combokeys.bind(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ], function(event) { // Handle shortcut
            insertSequenceString(String.fromCharCode(event.charCode));
        });
        combokeys.bind(['left','shift+left'] , function(event) { // Handle shortcut
            moveCaretShortcutFunctions.moveCaretLeftOne(event.shiftKey);
        });
        combokeys.bind(['right','shift+right'] , function(event) { // Handle shortcut
            moveCaretShortcutFunctions.moveCaretRightOne(event.shiftKey);
        });
        combokeys.bind(['up','shift+up'] , function(event) { // Handle shortcut
            moveCaretShortcutFunctions.moveCaretUpARow(event.shiftKey);
        });
        combokeys.bindGlobal(['down','shift+down'] , function(event) { // Handle shortcut
            moveCaretShortcutFunctions.moveCaretDownARow(event.shiftKey);
        });
        combokeys.bindGlobal(['mod+right','mod+shift+right'], function(event) { // Handle shortcut
            moveCaretShortcutFunctions.moveCaretToEndOfRow(event.shiftKey);
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal(['mod+left','mod+shift+left'], function(event) { // Handle shortcut
            moveCaretShortcutFunctions.moveCaretToStartOfRow(event.shiftKey);
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal(['mod+up','mod+shift+up'], function(event) { // Handle shortcut
            moveCaretShortcutFunctions.moveCaretToStartOfSequence(event.shiftKey);
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal(['mod+down','mod+shift+down'], function(event) { // Handle shortcut
            moveCaretShortcutFunctions.moveCaretToEndOfSequence(event.shiftKey);
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bind('backspace', function(event) { // Handle shortcut
            backspacePressed();
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal('command+a', function(event) { // Handle shortcut
            selectAll();
            event.stopPropagation();
        });
    }

    handlePaste(event) {
      var {
            pasteSequenceString,
        } = this.props.signals;
        event.clipboardData.items[0].getAsString(function(string) {
            pasteSequenceString(string);
        });
    }

    handleCopy() {
      var {
            copySelection,
        } = this.props.signals;
        copySelection();
        // this.props.selectedSequenceString
    }

    componentWillUnmount() {

        // Remove any Mousetrap bindings before unmounting.detach()
        combokeys.detach()
    }

    handleEditorClick(caretPosition) {
      var {
            setCaretPosition,
            setSelectionLayer
        } = this.props.signals;
        //if cursor position is different than the original position, reset the position and clear the selection
        // console.log('onclick!!');
        // var bp = this.getNearestCursorPositionToMouseEvent(event);
        if (this.editorBeingDragged) {
            //do nothing because the click was triggered by a drag event
        } else {
            setCaretPosition(caretPosition);
            setSelectionLayer(false);
        }

    }

    handleEditorDrag(caretPosition) {
      var {
            setCaretPosition,
            setSelectionLayer
        } = this.props.signals;
        //note this method relies on variables that are set in the handleEditorDragStart method!
        this.editorBeingDragged = true;
        if (caretPosition === this.fixedCaretPositionOnEditorDragStart) {
            setCaretPosition(caretPosition);
            setSelectionLayer(false);
        } else {
            var newSelectionLayer;
            if (this.fixedCaretPositionOnEditorDragStartType === 'start') {
                newSelectionLayer = {
                    start: this.fixedCaretPositionOnEditorDragStart,
                    end: caretPosition - 1,
                    cursorAtEnd: true,
                };
            } else if (this.fixedCaretPositionOnEditorDragStartType === 'end') {
                newSelectionLayer = {
                    start: caretPosition,
                    end: this.fixedCaretPositionOnEditorDragStart - 1,
                    cursorAtEnd: false,
                };
            } else {
                if (caretPosition > this.fixedCaretPositionOnEditorDragStart) {
                    newSelectionLayer = {
                        start: this.fixedCaretPositionOnEditorDragStart,
                        end: caretPosition - 1,
                        cursorAtEnd: true,
                    };
                } else {
                    newSelectionLayer = {
                        start: caretPosition,
                        end: this.fixedCaretPositionOnEditorDragStart - 1,
                        cursorAtEnd: false,
                    };
                }
            }
            setSelectionLayer(newSelectionLayer);
        }
    }

    handleEditorDragStart(caretPosition) {
      var {selectionLayer} = this.props;
        // var caretPosition = this.getNearestCursorPositionToMouseEvent(event);
        if (event.target.className === "cursor" && selectionLayer.selected) {
            // this.circularSelectionOnEditorDragStart = (selectionLayer.start > selectionLayer.end);
            if (selectionLayer.start === caretPosition) {
                this.fixedCaretPositionOnEditorDragStart = selectionLayer.end + 1;
                this.fixedCaretPositionOnEditorDragStartType = 'end';

                //plus one because the cursor position will be 1 more than the selectionLayer.end
                //imagine selection from
                //0 1 2  <--possible cursor positions
                // A T G
                //if A is selected, selection.start = 0, selection.end = 0
                //so the caretPosition for the end of the selection is 1!
                //which is selection.end+1
            } else {
                this.fixedCaretPositionOnEditorDragStart = selectionLayer.start;
                this.fixedCaretPositionOnEditorDragStartType = 'start';
            }
        } else {
            // this.circularSelectionOnEditorDragStart = false;
            this.fixedCaretPositionOnEditorDragStart = caretPosition;
            this.fixedCaretPositionOnEditorDragStartType = 'caret';
        }
    }

    handleEditorDragStop(event, ui) {
        var self = this;
        if (this.editorBeingDragged) { //check to make sure dragging actually occurred
            setTimeout(function() {
                //we use setTimeout to put the call to change editorBeingDragged to false
                //on the bottom of the event stack, thus the click event that is fired because of the drag
                //will be able to check if editorBeingDragged and not trigger if it is
                self.editorBeingDragged = false;
            }, 0);
        } else {
            self.editorBeingDragged = false;
        }
    }
  
  

  render() {
    var {
            setViewportDimensions,
            jumpToRow,
            toggleAnnotationDisplay,
            selectedSequenceString,
        } = this.props.signals;
      // var visibilityParameters = this.props.visibilityParameters;
      // var highlightLayer = this.props.highlightLayer;
    var self = this;
        var {
            selectionLayer,
            caretPosition,
            sequenceLength,
            bpsPerRow,
            totalRows,
            sequenceData
        } = this.props;
    var featuresCount = sequenceData.features ? sequenceData.features.length : 0;
    var annotationList = ['features', 'parts', 'translations', 'orfs', 'cutsites'];
    var toggleButtons = annotationList.map(function(annotationType, index){
      return (<button key={index} onClick={function () {
            toggleAnnotationDisplay(annotationType);
          }}>
           toggle {annotationType}
          </button>)
      });

    return (
      <div ref="sequenceEditor"
        style={{float:"right"}}>
        features count: {featuresCount}
        <br/>
        selectionLayer: {selectionLayer.start}  {selectionLayer.end}
        <br/>
        caretPosition: {caretPosition}
        <br/>
        sequence length: {sequenceLength}
        <br/>
        bpsPerRow:  {bpsPerRow}
        <br/>

        <button onClick={function () {
          setViewportDimensions({height: 800, width: 1500})
        }}>
         set viewport dimensions
        </button>

        {toggleButtons}

        <button onClick={function () {
          jumpToRow(self.props.newRandomRowToJumpTo)
        }}>
         Jump to a random row: Row #{self.props.newRandomRowToJumpTo.row}
        </button>
        
        <Clipboard
          value={selectedSequenceString}
          onCopy={this.handleCopy.bind(this)}
          onPaste={this.handlePaste.bind(this)}/>
        <br/>
        totalRows:  {totalRows}
        
        <RowView 
          handleEditorDrag={this.handleEditorDrag.bind(this)}
          handleEditorDragStart={this.handleEditorDragStart.bind(this)}
          handleEditorDragStop={this.handleEditorDragStop.bind(this)}
          handleEditorClick={this.handleEditorClick.bind(this)}
           />
             <br/>
             <br/>
             <br/>
        
      </div>
    );
  }
}

SequenceEditor.propTypes = {
    sequenceLength: PropTypes.number.isRequired,
    bpsPerRow: PropTypes.number.isRequired,
    totalRows: PropTypes.number.isRequired,
    newRandomRowToJumpTo: PropTypes.object,
    selectedSequenceString: PropTypes.string.isRequired,
    caretPosition: PropTypes.number.isRequired,
    sequenceData: PropTypes.object.isRequired,
    selectionLayer: PropTypes.object.isRequired,
    clipboardData: PropTypes.object.isRequired,
}


// <MapView 
//           {...this.props}
//           />


// <button onClick={function () {
//           jumpToRow(self.props.newRandomRowToJumpTo),
//         }}>
//           Jump to a random row: Row #{self.props.newRandomRowToJumpTo.row}
//         </button>

module.exports = SequenceEditor;
