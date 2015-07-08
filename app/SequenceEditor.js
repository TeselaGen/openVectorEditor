var React = require('react');

var RowView = require('./RowView');
var charWidth = require('./editorConstants').charWidth;

var baoababBranch = require('baobab-react/mixins').branch;
var MousetrapMixin = require('./MousetrapMixin');
// var Clipboard = require("react-clipboard");
var appActions = require('./actions/appActions');
var Clipboard = require('./Clipboard');

var SequenceEditor = React.createClass({
  mixins: [baoababBranch, MousetrapMixin],
  facets: {
    sequenceLength: 'sequenceLength',
    bpsPerRow: 'bpsPerRow',
    // orfData: 'orfData',
    totalRows: 'totalRows',
    selectedSequenceString: 'selectedSequenceString',
  },
  cursors: {
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
      appActions.insertSequenceString(String.fromCharCode(event.charCode));
    });
    this.bindShortcut('left', function(event) { // Handle shortcut
      //trigger a caret left
      appActions.moveCaretLeftOne();
    });
    this.bindShortcut('right', function(event) { // Handle shortcut
      //trigger a caret left
      appActions.moveCaretRightOne();
    });
    this.bindShortcut('up', function(event) { // Handle shortcut
      //trigger a caret left
      appActions.moveCaretUpARow();
    });
    this.bindShortcut('down', function(event) { // Handle shortcut
      //trigger a caret left
      appActions.moveCaretDownARowShiftHeld();
    });
    this.bindShortcut('shift+left', function(event) { // Handle shortcut
      //trigger a caret left
      appActions.moveCaretLeftOneShiftHeld();
    });
    this.bindShortcut('shift+right', function(event) { // Handle shortcut
      //trigger a caret left
      appActions.moveCaretRightOneShiftHeld();
    });
    this.bindShortcut('shift+up', function(event) { // Handle shortcut
      //trigger a caret left
      appActions.moveCaretUpARowShiftHeld();
    });
    this.bindShortcut('shift+down', function(event) { // Handle shortcut
      //trigger a caret left
      appActions.moveCaretDownARowShiftHeld();
    });
    this.bindShortcut('backspace', function(event) { // Handle shortcut
      //trigger a caret left
      event.preventDefault();
      appActions.backspacePressed();
    });
    this.bindShortcut('backspace', function(event) { // Handle shortcut
      //trigger a caret left
      appActions.backspacePressed();
      event.stopPropagation();
    });
    this.bindGlobal('command+a', function(event) { // Handle shortcut
      appActions.selectAll();
      event.stopPropagation();
    });
  },

  handlePaste: function(event) {
    console.log('paste!');
    event.clipboardData.items[0].getAsString(function(string) {
      appActions.pasteSequenceString(string);
    });
  },

  handleCopy: function(event) {
    console.log('copy!');
    appActions.copySelection();
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
