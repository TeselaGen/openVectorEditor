var React = require('react');

var RowView = require('./RowView');
var charWidth = require('./editorConstants').charWidth;

var baoababBranch = require('baobab-react/mixins').branch;
var MousetrapMixin = require('./MousetrapMixin');
// var Clipboard = require("react-clipboard");
var insertSequenceString = require('./actions/insertSequenceString');
var backspacePressed = require('./actions/backspacePressed');
var pasteSequenceString = require('./actions/pasteSequenceString');
var copySelection = require('./actions/copySelection');
var selectAll = require('./actions/selectAll');
var moveCaretShortcutFunctions = require('./actions/moveCaretShortcutFunctions');
var Clipboard = require('./Clipboard');

var SequenceEditor = React.createClass({
  mixins: [baoababBranch, MousetrapMixin],
  cursors: {
    sequenceLength: ['$sequenceLength'],
    bpsPerRow: ['$bpsPerRow'],
    totalRows: ['$totalRows'],
    selectedSequenceString: ['$selectedSequenceString'],
    caretPosition: ['vectorEditorState', 'caretPosition'],
    sequenceData: ['vectorEditorState', 'sequenceData'],
    visibleRows: ['vectorEditorState', 'visibleRows'],
    selectionLayer: ['vectorEditorState', 'selectionLayer'],
    clipboardData: ['vectorEditorState', 'clipboardData'],
  },
  // cursors: {
  //   visibilityParameters: ['vectorEditorState', 'visibilityParameters'],
  //   sequenceData: ['vectorEditorState', 'sequenceData'],
  //   highlightLayer: ['vectorEditorState', 'highlightLayer'],
  // },

  componentDidMount: function () {
    var self = this;
    //bind a bunch of keyboard shortcuts we're interested in catching
    //we're using the "mousetrap" library (available thru npm: https://www.npmjs.com/package/br-mousetrap)
    //documentation: https://craig.is/killing/mice
    this.bindShortcut(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ], function(event) { // Handle shortcut
      insertSequenceString(String.fromCharCode(event.charCode));
    });
    this.bindShortcut('left', function(event) { // Handle shortcut
      //trigger a caret left
      moveCaretShortcutFunctions.moveCaretLeftOne();
    });
    this.bindShortcut('right', function(event) { // Handle shortcut
      //trigger a caret left
      moveCaretShortcutFunctions.moveCaretRightOne();
    });
    this.bindShortcut('up', function(event) { // Handle shortcut
      //trigger a caret left
      moveCaretShortcutFunctions.moveCaretUpARow();
    });
    this.bindShortcut('down', function(event) { // Handle shortcut
      //trigger a caret left
      moveCaretShortcutFunctions.moveCaretDownARowShiftHeld();
    });
    this.bindShortcut('shift+left', function(event) { // Handle shortcut
      //trigger a caret left
      moveCaretShortcutFunctions.moveCaretLeftOneShiftHeld();
    });
    this.bindShortcut('shift+right', function(event) { // Handle shortcut
      //trigger a caret left
      moveCaretShortcutFunctions.moveCaretRightOneShiftHeld();
    });
    this.bindShortcut('shift+up', function(event) { // Handle shortcut
      //trigger a caret left
      moveCaretShortcutFunctions.moveCaretUpARowShiftHeld();
    });
    this.bindShortcut('shift+down', function(event) { // Handle shortcut
      //trigger a caret left
      moveCaretShortcutFunctions.moveCaretDownARowShiftHeld();
    });
    this.bindShortcut('backspace', function(event) { // Handle shortcut
      backspacePressed();
      event.stopPropagation();
      event.preventDefault();
    });
    this.bindGlobal('command+a', function(event) { // Handle shortcut
      selectAll();
      event.stopPropagation();
    });
  },

  handlePaste: function(event) {
    event.clipboardData.items[0].getAsString(function(string) {
      pasteSequenceString(string);
    });
  },

  handleCopy: function(event) {
    copySelection();
    // this.state.selectedSequenceString
  },
  render: function() {
      // var visibilityParameters = this.state.visibilityParameters;
      // var highlightLayer = this.state.highlightLayer;
      // visibilityParameters.rowWidth = charWidth * visibilityParameters.bpsPerRow;

    var featuresCount = this.state.sequenceData.features ? this.state.sequenceData.features.length : 0;
    
    return (
      <div style={{float:"right"}}>
        features count: {featuresCount}
        <br/>
        selectionLayer: {this.state.selectionLayer.start}  {this.state.selectionLayer.end}
        <br/>
        caretPosition: {this.state.caretPosition}
        <br/>
        sequence length: {this.state.sequenceLength}
        <br/>
        visible rows: {this.state.visibleRows.start + ' - ' + this.state.visibleRows.end}
        <br/>
        bpsPerRow:  {this.state.bpsPerRow}
        <br/>
          <Clipboard
            value={this.state.selectedSequenceString}
            onCopy={this.handleCopy}
            onPaste={this.handlePaste}/>
        <br/>
        totalRows:  {this.state.totalRows}
        <RowView />
      </div>
    );
  }
});

module.exports = SequenceEditor;
