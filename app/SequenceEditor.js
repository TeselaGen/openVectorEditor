var React = require('react');

var RowView = require('./RowView');
// var MapView = require('./MapView');

var baoababBranch = require('baobab-react/mixins').branch;
var MousetrapMixin = require('./MousetrapMixin');
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
    mixins: [baoababBranch, MousetrapMixin],
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

    handleCopy: function() {
        copySelection();
        // this.state.selectedSequenceString
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
            bpsPerRow
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
          value={this.state.selectedSequenceString}
          onCopy={this.handleCopy}
          onPaste={this.handlePaste}/>
        <br/>
        totalRows:  {this.state.totalRows}
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
          charWidth={charWidth}
          selectionLayer={selectionLayer}
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
