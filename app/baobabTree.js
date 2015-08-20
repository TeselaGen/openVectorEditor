var baobab = require('baobab');
// var sequenceData = require('./sequenceData');
var sequenceData = require('./sequenceDataWithOrfsAndTranslations');
var prepareRowData = require('./prepareRowData');
var findOrfsInPlasmid = require('./findOrfsInPlasmid');
var validateAndTidyUpSequenceData = require('./validateAndTidyUpSequenceData');
var assign = require('lodash/object/assign');
var getSequenceWithinRange = require('./getSequenceWithinRange');
var getAminoAcidDataForEachBaseOfDna = require('./getAminoAcidDataForEachBaseOfDna');

var tree = new baobab({
  vectorEditorState: {
    topSpacerHeight: 0,
    bottomSpacerHeight: 0,
    averageRowHeight: 100,
    charWidth: 15,
    CHAR_HEIGHT: 15,
    ANNOTATION_HEIGHT: 15,
    minimumOrfSize: 300,
    tickSpacing: 21,
    SPACE_BETWEEN_ANNOTATIONS: 3,
    preloadRowStart: 0,
    showOrfs: true,
    allowPartialAnnotationsOnCopy: false,
    showCutsites: true,
    showParts: true,
    showFeatures: true,
    showTranslations: true,
    showAxis: true,
    showReverseSequence: false,
    rowViewDimensions: {
      height: 500, //come back and make these dynamic
      width: 500
    },
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
    ['vectorEditorState', 'rowViewDimensions',
      'width'
    ],
    ['vectorEditorState', 'charWidth'],
    function(rowViewDimensionsWidth, charWidth) {
      return Math.floor(rowViewDimensionsWidth / charWidth);
    }
  ],
  $translationsWithAminoAcids: [
    ['vectorEditorState', 'sequenceData','translations'],
    ['vectorEditorState', 'sequenceData','sequence'],
    function getTranslationsWithAminoAcids (translations, sequence) {
      return translations.map(function(translation){
        var translationWithAminoAcids = assign({},translation);
        var subseq = getSequenceWithinRange(translation, sequence);
        translationWithAminoAcids.aminoAcids = getAminoAcidDataForEachBaseOfDna(subseq, (translation.strand == -1 ? false : true));
        return translationWithAminoAcids;
      });
    }
  ],
  $sequenceLength: [
    ['vectorEditorState', 'sequenceData'],
    function(sequenceData) {
      return sequenceData.sequence ? sequenceData.sequence.length : 0;
    }
  ],
  $selectedSequenceString: [
    ['vectorEditorState', 'sequenceData', 'sequence'],
    ['vectorEditorState', 'selectionLayer'],
    function(sequence, selectionLayer) {
      if (sequence && selectionLayer && selectionLayer.selected) {
        return getSequenceWithinRange(selectionLayer, sequence);
      } else {
        return '';
      }
    }
  ],
  $orfData: [
    ['vectorEditorState', 'sequenceData', 'sequence'],
    ['vectorEditorState', 'sequenceData', 'circular'], //decide on what to call this..
    ['vectorEditorState', 'minimumOrfSize'],
    findOrfsInPlasmid
  ],
  $combinedSequenceData: [ //holds usual sequence data, plus orfs, plus parts..
    ['vectorEditorState', 'sequenceData'],
    ['$orfData'],
    ['$translationsWithAminoAcids'],
    function(sequenceData, orfData, translations) {
      return assign({}, sequenceData, {
        orfs: orfData,
        translations: translations
      });
    }
  ],
  $rowData: [
    ['$combinedSequenceData'],
    ['$bpsPerRow'],
    function(sequenceData, bpsPerRow) {
      console.log('rowDataUpdated!');
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
});

module.exports = tree;