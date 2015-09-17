var React = require('react');
var Combokeys = require("combokeys");
var combokeys;
var bindGlobalPlugin = require('combokeys/plugins/global-bind')

var RowView = require('./RowView');
// var MapView = require('./MapView');

var baoababBranch = require('baobab-react/mixins').branch;
var insertSequenceString = require('./actions/insertSequenceString');
var backspacePressed = require('./actions/backspacePressed');
var pasteSequenceString = require('./actions/pasteSequenceString');
var copySelection = require('./actions/copySelection');
var selectAll = require('./actions/selectAll');
var moveCaretShortcutFunctions = require('./actions/moveCaretShortcutFunctions');
var setViewportDimensions = require('./actions/setViewportDimensions');
var jumpToRow = require('./actions/jumpToRow');
var toggleAnnotationDisplay = require('./actions/toggleAnnotationDisplay');
var Clipboard = require('./Clipboard');

var SequenceEditor = React.createClass({
    mixins: [baoababBranch],
    cursors: {
        sequenceLength: ['sequenceLength'],
        bpsPerRow: ['bpsPerRow'],
        totalRows: ['totalRows'],
        newRandomRowToJumpTo: ['newRandomRowToJumpTo'],
        selectedSequenceString: ['selectedSequenceString'],
        caretPosition: ['caretPosition'],
        sequenceData: ['sequenceData'],
        visibleRows: ['visibleRows'],
        selectionLayer: ['selectionLayer'],
        clipboardData: ['clipboardData'],
        preloadRowStart: ['preloadRowStart'],
        averageRowHeight: ['averageRowHeight'],
        rowViewDimensions: ['rowViewDimensions'],
        rowData: ['rowData'],
        // visibleRows: ['visibleRows'],
        rowToJumpTo: ['rowToJumpTo'],
        charWidth: ['charWidth'],
        CHAR_HEIGHT: ['CHAR_HEIGHT'], //potentially unneeded
        ANNOTATION_HEIGHT: ['ANNOTATION_HEIGHT'],
        tickSpacing: ['tickSpacing'],
        SPACE_BETWEEN_ANNOTATIONS: ['SPACE_BETWEEN_ANNOTATIONS'],
        showFeatures: ['showFeatures'],
        showTranslations: ['showTranslations'],
        showParts: ['showParts'],
        showOrfs: ['showOrfs'],
        showAxis: ['showAxis'],
        showCutsites: ['showCutsites'],
        showReverseSequence: ['showReverseSequence'],
        mouse: ['mouse'],
    },
    // cursors: {
    //   visibilityParameters: ['visibilityParameters'],
    //   sequenceData: ['sequenceData'],
    //   highlightLayer: ['highlightLayer'],
    // },

    componentDidMount: function() {
        var self = this;
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
    },

    handlePaste: function(event) {
        event.clipboardData.items[0].getAsString(function(string) {
            pasteSequenceString(string);
        });
    },

    handleCopy: function() {
        copySelection();
        // this.state.selectedSequenceString
    },

    componentWillUnmount: function() {
        // Remove any Mousetrap bindings before unmounting.detach()
        combokeys.detach()
    },
  
  

  render: function() {
      // var visibilityParameters = this.state.visibilityParameters;
      // var highlightLayer = this.state.highlightLayer;
      // visibilityParameters.rowWidth = charWidth * visibilityParameters.bpsPerRow;
    var self = this;
        var {
            preloadRowStart, 
            averageRowHeight, 
            rowViewDimensions, 
            totalRows, rowData, 
            rowToJumpTo, 
            charWidth, 
            selectionLayer, 
            CHAR_HEIGHT,
            ANNOTATION_HEIGHT,
            tickSpacing,
            SPACE_BETWEEN_ANNOTATIONS,
            showFeatures,
            showTranslations,
            showParts,
            showOrfs,
            showAxis,
            showCutsites,
            showReverseSequence,
            mouse,
            caretPosition,
            sequenceLength,
            bpsPerRow,
            selectedSequenceString,
            visibleRows,
        } = this.state;
    var featuresCount = this.state.sequenceData.features ? this.state.sequenceData.features.length : 0;
    var annotationList = ['features', 'parts', 'translations', 'orfs', 'cutsites'];
    var toggleButtons = annotationList.map(function(annotationType){
      return (<button onClick={function () {
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
        visible rows: {visibleRows.start + ' - ' + visibleRows.end}
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
          jumpToRow(self.state.newRandomRowToJumpTo)
        }}>
         Jump to a random row: Row #{self.state.newRandomRowToJumpTo.row}
        </button>
        
        <Clipboard
          value={selectedSequenceString}
          onCopy={this.handleCopy}
          onPaste={this.handlePaste}/>
        <br/>
        totalRows:  {totalRows}
        <RowView 
          charWidth={charWidth}
          CHAR_HEIGHT={CHAR_HEIGHT}
          ANNOTATION_HEIGHT={ANNOTATION_HEIGHT}
          tickSpacing={tickSpacing}
          SPACE_BETWEEN_ANNOTATIONS={SPACE_BETWEEN_ANNOTATIONS}
          showFeatures={showFeatures}
          showTranslations={showTranslations}
          showParts={showParts}
          showOrfs={showOrfs}
          showAxis={showAxis}
          showCutsites={showCutsites}
          showReverseSequence={showReverseSequence}
          selectionLayer={selectionLayer}
          mouse={mouse}
          caretPosition={caretPosition}
          sequenceLength={sequenceLength}
          bpsPerRow={bpsPerRow}
          preloadRowStart={preloadRowStart}
          averageRowHeight={averageRowHeight}
          rowViewDimensions={rowViewDimensions}
          totalRows={totalRows}
          rowData={rowData}
          rowToJumpTo={rowToJumpTo}
          />
      </div>
    );
  }
});

// <button onClick={function () {
//           jumpToRow(self.state.newRandomRowToJumpTo),
//         }}>
//           Jump to a random row: Row #{self.state.newRandomRowToJumpTo.row}
//         </button>

module.exports = SequenceEditor;
