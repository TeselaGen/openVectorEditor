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
  $bpsPerRow: {
    cursors: {
      viewportDimensionsWidth: ['vectorEditorState', 'viewportDimensions',
        'width'
      ],
      charWidth: ['vectorEditorState', 'charWidth'],
    },
    get: function(state) {
      return Math.floor(state.viewportDimensionsWidth / state.charWidth);
    }
  },
  $sequenceLength: {
    cursors: {
      sequenceData: ['vectorEditorState', 'sequenceData'],
    },
    get: function(state) {
      return state.sequenceData.sequence ? state.sequenceData.sequence.length :
        0;
    }
  },
  $aminoAcidRepresentationOfSequence: {
    cursors: {
      sequence: ['vectorEditorState', 'sequenceData', 'sequence'],
      circular: ['vectorEditorState', 'sequenceData', 'circular'], //decide on what to call this..
    },
    get: function(state) {
      return getAminoAcidRepresentationOfSequence(state.sequence, state.circular); //might not want to pass circular here..
    }
  },
  $orfData: {
    cursors: {
      sequence: ['vectorEditorState', 'sequenceData', 'sequence'],
      circular: ['vectorEditorState', 'sequenceData', 'circular'], //decide on what to call this..
      minimumOrfSize: ['vectorEditorState', 'minimumOrfSize'],
    },
    get: function(state) {
      return findOrfsFromSequence(state.sequence, state.circular, state.minimumOrfSize);
    }
  },
  $rowData: {
    cursors: {
      sequenceData: ['vectorEditorState', 'sequenceData'],
      bpsPerRow: ['$bpsPerRow'],
    },
    get: function(state) {
      return prepareRowData(state.sequenceData, state.bpsPerRow);
    }
  },
  $totalRows: {
    cursors: {
      rowData: ['$rowData'],
    },
    get: function(state) {
      if (state.rowData) {
        return state.rowData.length;
      }
    }
  },
  $combinedSequenceData: { //holds usual sequence data, plus orfs, plus parts..
    cursors: {
      sequenceData: ['vectorEditorState', 'sequenceData'],
      orfData: ['orfData'],
    },
    get: function(state) {
      return assign({}, state.sequenceData, {
        orfs: state.orfData
      });
    }
  },
  $visibleRowsData: {
    cursors: {
      visibleRows: ['vectorEditorState', 'visibleRows'],
      rowData: ['$rowData']
    },
    get: function(state) {
      console.log('state: ' + state.visibleRows.start + "  " + state.visibleRows.end);
      if (state.rowData && state.visibleRows) {
        return state.rowData.slice(state.visibleRows.start, state.visibleRows.end + 1);
      }
    }
  },
  $selectedSequenceString: {
    cursors: {
      sequence: ['vectorEditorState', 'sequenceData', 'sequence'],
      selectionLayer: ['vectorEditorState', 'selectionLayer'],
    },
    get: function(state) {
      if (state.sequence && state.selectionLayer && state.selectionLayer.selected) {
        return getSubstringByRange(state.sequence, state.selectionLayer);
      } else {
        return '';
      }
    }
  }
});

module.exports = tree;