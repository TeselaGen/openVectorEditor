import React, {PropTypes} from 'react';
import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies
var Combokeys = require("combokeys");
var combokeys;
var bindGlobalPlugin = require('combokeys/plugins/global-bind');

var RowView = require('./RowView');
var MapView = require('./MapView');
var CircularView = require('./CircularView');

var Clipboard = require('./Clipboard');
import {Decorator as Cerebral} from 'cerebral-react';

import ToolBar from './ToolBar';
import StatusBar from './StatusBar';

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
    displayCircular: ['displayCircular'],
    displayLinear: ['displayLinear'],
    displayRow: ['displayRow'],
    showSideMenu: ['showSideMenu']
})
@propTypes({
    sequenceLength: PropTypes.number.isRequired,
    bpsPerRow: PropTypes.number.isRequired,
    totalRows: PropTypes.number.isRequired,
    newRandomRowToJumpTo: PropTypes.object,
    selectedSequenceString: PropTypes.string.isRequired,
    caretPosition: PropTypes.number.isRequired,
    sequenceData: PropTypes.object.isRequired,
    selectionLayer: PropTypes.object.isRequired,
    clipboardData: PropTypes.object.isRequired,
    displayCircular: PropTypes.bool.isRequired,
    displayLinear: PropTypes.bool.isRequired,
    displayRow: PropTypes.bool.isRequired,
    showSideMenu: PropTypes.bool.isRequired
})
class SequenceEditor extends React.Component {
    componentDidMount() {
        var {
            sequenceDataInserted,
            backspacePressed,
            selectAll,
        } = this.props.signals;
        var self = this;
        combokeys = new Combokeys(document.documentElement);
        // combokeys = new Combokeys(React.findDOMNode(this.refs.sequenceEditor));
        bindGlobalPlugin(combokeys);

        //bind a bunch of keyboard shortcuts we're interested in catching
        //we're using the "mousetrap" library (available thru npm: https://www.npmjs.com/package/br-mousetrap)
        //documentation: https://craig.is/killing/mice
        combokeys.bind(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ], function(event) { // Handle shortcut
            sequenceDataInserted({newSequenceData: {sequence: String.fromCharCode(event.charCode)}});
        });
        combokeys.bind(['left','shift+left'] , function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretLeftOne'});
        });
        combokeys.bind(['right','shift+right'] , function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretRightOne'});
        });
        combokeys.bind(['up','shift+up'] , function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretUpARow'});
        });
        combokeys.bindGlobal(['down','shift+down'] , function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretDownARow'});
        });
        combokeys.bindGlobal(['mod+right','mod+shift+right'], function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretToEndOfRow'});
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal(['mod+left','mod+shift+left'], function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretToStartOfRow'});
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal(['mod+up','mod+shift+up'], function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretToStartOfSequence'});
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal(['mod+down','mod+shift+down'], function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretToEndOfSequence'});
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

    handleEditorClick({nearestBP, shiftHeld}) {
        //if cursor position is different than the original position, reset the position and clear the selection
        if (this.editorBeingDragged) {
            //do nothing because the click was triggered by a drag event
        } else {
            this.props.signals.editorClicked({
                shiftHeld,
                type: 'editorClick',
                updatedCaretPos: nearestBP
            })
        }
    }

    handleEditorDrag({nearestBP}) {
        var {
            setCaretPosition,
            setSelectionLayer
        } = this.props.signals;
        //note this method relies on variables that are set in the handleEditorDragStart method!
        this.editorBeingDragged = true;
        console.log('nearestBP: ' + JSON.stringify(nearestBP,null,4));
        if (nearestBP === this.fixedCaretPositionOnEditorDragStart) {
            setCaretPosition(nearestBP);
            setSelectionLayer(false);
        } else {
            var newSelectionLayer;
            if (this.fixedCaretPositionOnEditorDragStartType === 'start') {
                newSelectionLayer = {
                    start: this.fixedCaretPositionOnEditorDragStart,
                    end: nearestBP - 1,
                    cursorAtEnd: true,
                };
            } else if (this.fixedCaretPositionOnEditorDragStartType === 'end') {
                newSelectionLayer = {
                    start: nearestBP,
                    end: this.fixedCaretPositionOnEditorDragStart - 1,
                    cursorAtEnd: false,
                };
            } else {
                if (nearestBP > this.fixedCaretPositionOnEditorDragStart) {
                    newSelectionLayer = {
                        start: this.fixedCaretPositionOnEditorDragStart,
                        end: nearestBP - 1,
                        cursorAtEnd: true,
                    };
                } else {
                    newSelectionLayer = {
                        start: nearestBP,
                        end: this.fixedCaretPositionOnEditorDragStart - 1,
                        cursorAtEnd: false,
                    };
                }
            }
            setSelectionLayer({selectionLayer: newSelectionLayer});
        }
    }

    handleEditorDragStart({nearestBP, dragInitiatedByGrabbingCaret}) {
        var {selectionLayer} = this.props;
        if (dragInitiatedByGrabbingCaret && selectionLayer.selected) {
            // this.circularSelectionOnEditorDragStart = (selectionLayer.start > selectionLayer.end);
            if (selectionLayer.start === nearestBP) {
                this.fixedCaretPositionOnEditorDragStart = selectionLayer.end + 1;
                this.fixedCaretPositionOnEditorDragStartType = 'end';

                //plus one because the cursor position will be 1 more than the selectionLayer.end
                //imagine selection from
                //0 1 2  <--possible cursor positions
                // A T G
                //if A is selected, selection.start = 0, selection.end = 0
                //so the nearestBP for the end of the selection is 1!
                //which is selection.end+1
            } else {
                this.fixedCaretPositionOnEditorDragStart = selectionLayer.start;
                this.fixedCaretPositionOnEditorDragStartType = 'start';
            }
        } else {
            // this.circularSelectionOnEditorDragStart = false;
            this.fixedCaretPositionOnEditorDragStart = nearestBP;
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
            selectedSequenceString,
            displayCircular,
            displayRow,
            showSideMenu
        } = this.props;

        return (
            <div ref="sequenceEditor">
                <Clipboard
                    value={selectedSequenceString}
                    onCopy={this.handleCopy.bind(this)}
                    onPaste={this.handlePaste.bind(this)}/>

                    { showSideMenu && <div style={ { width: '20%', float: 'left', height: '100%',
                        zIndex: '9999',
                        background: 'white',
                        border: '2px solid black',
                        position: 'absolute',
                        padding: '20px',
                        fontSize: '24px',
                        fontFamily: 'sans'
                    } }>
                    …this, however, is not.
                </div>}

                <div style={ { width: (showSideMenu) ? '70%' : '100%', float: 'right' } }>
                    <ToolBar />
                    
                    <div style={{display: 'flex', overflow: 'auto'}}>
                        {displayCircular && <CircularView 
                                              handleEditorDrag={this.handleEditorDrag.bind(this)}
                                              handleEditorDragStart={this.handleEditorDragStart.bind(this)}
                                              handleEditorDragStop={this.handleEditorDragStop.bind(this)}
                                              handleEditorClick={this.handleEditorClick.bind(this)}
                                               />}
                        
                        {displayRow &&  <RowView 
                                              handleEditorDrag={this.handleEditorDrag.bind(this)}
                                              handleEditorDragStart={this.handleEditorDragStart.bind(this)}
                                              handleEditorDragStop={this.handleEditorDragStop.bind(this)}
                                              handleEditorClick={this.handleEditorClick.bind(this)}
                                               />}
                    </div>
                    
                    <StatusBar/>
                </div>

                <div style={{clear: 'both'}}></div>
            </div>
        );
    }
}

module.exports = SequenceEditor;
