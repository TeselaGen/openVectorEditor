var baobab = require('baobab');
// var sequenceData = require('./sequenceData');
var sequenceData = require('./sequenceDataWithOrfs');
var ObjectID = require("bson-objectid");
var prepareRowData = require('./prepareRowData');
var findOrfsFromSequence = require('./findOrfsFromSequence');
var computeRowRepresentationOfSequence = require('./computeRowRepresentationOfSequence');
var validateAndTidyUpSequenceData = require('./validateAndTidyUpSequenceData');
var getSubstringByRange = require('get-substring-by-range');
var assign = require('lodash/object/assign');

// // tnr: this is used to generate a very large, multi-featured sequence
// var string = "atgtagagagagagaggtgatg";
// var reallyLongFakeSequence = "";
// for (var i = 1; i < 1000; i++) {
// 	reallyLongFakeSequence += string;
// 	if (i % 100 === 0) {
// 		sequenceData.features.push({
// 			id: i,
// 			start: i*10,
// 			end: i*10 + 100,
// 			name: 'cooljim',
// 			color: 'green',
// 			forward: true,
// 			annotationType: "feature"
// 		});
// 	}
// }
// sequenceData.sequence = reallyLongFakeSequence;


// var fakeSequences = makeFakeSequences(20);
// console.log(fakeSequences);

// function makeFakeSequences(numberOfFakesSequencesToGenerate) {
// 	var fakeSequences = {};
// 	for (var i = 0; i < numberOfFakesSequencesToGenerate; i++) {
// 		console.log(ObjectID().str);
// 		fakeSequences[ObjectID().str] = sequenceData;
// 	}
// 	return fakeSequences;
// 	console.log(fakeSequences);
// }

// sequenceData.features = {};
// sequenceData.parts = {};

var tree = new baobab({
  vectorEditorState: {
    topSpacerHeight: 0,
    bottomSpacerHeight: 0,
    averageRowHeight: 100,
    // preloadBasepairStart: 300,
    charWidth: 15,
    CHAR_HEIGHT: 15,
    // FONT_SIZE: 14,
    ANNOTATION_HEIGHT: 15,
    minimumOrfSize: 50,
    tickSpacing: 10,
    SPACE_BETWEEN_ANNOTATIONS: 3,
    preloadRowStart: 0,
    // preloadRowEnd: 9,
    showOrfs: true,
    allowPartialAnnotationsOnCopy: false,
    showCutsites: true,
    showParts: true,
    showFeatures: true,
    showAxis: true,
    showReverseSequence: true,
    viewportDimensions: {
      height: 500, //come back and make these dynamic
      width: 500
    },
    selectionLayer: {
      start: 12,
      end: 9,
      selected: true,
      cursorAtEnd: true
    },
    mouse: {
      isDown: false,
      isSelecting: false,
    },
    caretPosition: -1,
    visibleRows: {
      start: 0,
      end: 0,
    },
    sequenceData: validateAndTidyUpSequenceData(sequenceData),
    clipboardData: null
  },
  $bpsPerRow: [
    ['vectorEditorState', 'viewportDimensions',
      'width'
    ],
    ['vectorEditorState', 'charWidth'],
    function(viewportDimensionsWidth, charWidth) {
      return Math.floor(viewportDimensionsWidth / charWidth);
    }
  ],
  $sequenceLength: [
    ['vectorEditorState', 'sequenceData'],
    function(sequenceData) {
      return sequenceData.sequence ? sequenceData.sequence.length : 0;
    }
  ],
  $aminoAcidRepresentationOfSequence: [
    ['vectorEditorState', 'sequenceData', 'sequence'],
    ['vectorEditorState', 'sequenceData', 'circular'], //decide on what to call this..
    function(sequence, circular) {
      return getAminoAcidRepresentationOfSequence(sequence, circular); //might not want to pass circular here..
    }
  ],
  $orfData: [
    ['vectorEditorState', 'sequenceData', 'sequence'],
    ['vectorEditorState', 'sequenceData', 'circular'], //decide on what to call this..
    ['vectorEditorState', 'minimumOrfSize'],
    function(sequence, circular, minimumOrfSize) {
      return findOrfsFromSequence(sequence, circular, minimumOrfSize);
    }
  ],
  $rowData: [
    ['$combinedSequenceData'],
    ['$bpsPerRow'],
    function(sequenceData, bpsPerRow) {
      return prepareRowData(sequenceData, bpsPerRow);
    }
  ],
  $totalRows: [
    ['$rowData'],
    function(rowData) {
      if (rowData) {
        return rowData.length;
      }
    }
  ],
  $combinedSequenceData: [ //holds usual sequence data, plus orfs, plus parts..
    ['vectorEditorState', 'sequenceData'],
    ['orfData'],
    function(sequenceData, orfData) {
      return assign({}, sequenceData, {
        orfs: orfData
      });
    }
  ],
  $visibleRowsData: [
    ['vectorEditorState', 'visibleRows'],
    ['$rowData'],
    function(visibleRows, rowData) {
      console.log('state: ' + visibleRows.start + "  " + visibleRows.end);
      if (rowData && visibleRows) {
        return rowData.slice(visibleRows.start, visibleRows.end + 1);
      }
    }
  ],
  $selectedSequenceString: [
    ['vectorEditorState', 'sequenceData', 'sequence'],
    ['vectorEditorState', 'selectionLayer'],
    function(sequence, selectionLayer) {
      if (sequence && selectionLayer && selectionLayer.selected) {
        return getSubstringByRange(sequence, selectionLayer);
      } else {
        return '';
      }
    }
  ]
});

module.exports = tree;