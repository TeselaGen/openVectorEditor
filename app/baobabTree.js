var Baobab = require('baobab');
var monkey = Baobab.monkey
// var sequenceData = require('./sequenceData');
// var sequenceData = require('./sequenceDataWithOrfsAndTranslations3');
var sequenceData = require('./sequenceDataWithOrfsAndTranslations');
var prepareRowData = require('./prepareRowData');
var findOrfsInPlasmid = require('ve-sequence-utils/findOrfsInPlasmid');
var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData');
var assign = require('lodash/object/assign');
var getSequenceWithinRange = require('ve-range-utils/getSequenceWithinRange');
var getAminoAcidDataForEachBaseOfDna = require('ve-sequence-utils/getAminoAcidDataForEachBaseOfDna');
var getCutsitesFromSequence = require('ve-sequence-utils/getCutsitesFromSequence');
var enzymeList = require('ve-sequence-utils/enzymeList');

var tree = new Baobab({
    rowToJumpTo: null,
    topSpacerHeight: 0,
    bottomSpacerHeight: 0,
    averageRowHeight: 100,
    charWidth: 15,
    CHAR_HEIGHT: 15,
    ANNOTATION_HEIGHT: 15,
    minimumOrfSize: 200,
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
    showReverseSequence: true,
    rowViewDimensions: {
        height: 500, //come back and make these dynamic
        width: 500
    },
    userEnzymeList: [
        'rsplkii',
        'bme216i',
        'bsmbi',
        'uba1229i',
        'maek81i', "esphk22i",
        "slu1777i",
        "bshhi",
        "ssp2i",
        "cspai",
        "btsi",
        "aspmi",
        "ngoeii",
        "bsu1532i",
        "dsai",
        "bstri",
        "pru2i",
        "uba1439i",
        "bsrfi",
        "bseri",
        "mizi",
        "hgibi",
        "bari",
        "nsici"
    ],
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
        isSelecting: false
    },
    caretPosition: -1,
    visibleRows: {
        start: 0,
        end: 0
    },
    sequenceData: tidyUpSequenceData(sequenceData),
    clipboardData: null,
    bpsPerRow: monkey([
        ['rowViewDimensions',
            'width'
        ],
        ['charWidth'],
        function(rowViewDimensionsWidth, charWidth) {
            return Math.floor(rowViewDimensionsWidth / charWidth);
        }
    ]),
    userEnzymes: monkey([
        ['userEnzymeList'],
        function(userEnzymeList) {
            return userEnzymeList.map(function(enzymeName) {
                return enzymeList[enzymeName];
            });
        }
    ]),
    cutsitesByName: monkey([
        ['sequenceData', 'sequence'],
        ['sequenceData', 'circular'],
        ['userEnzymes'],
        getCutsitesFromSequence
    ]),
    cutsites: monkey([
        ['cutsitesByName'],
        function (cutsitesByName) {
            var cutsitesArray = [];
            Object.keys(cutsitesByName).forEach(function (key) {
                // return cutsitesByName[key]
                cutsitesArray = cutsitesArray.concat(cutsitesByName[key]);
            });
            return cutsitesArray;
        }
    ]),
    translationsWithAminoAcids: monkey([
        ['sequenceData', 'translations'],
        ['sequenceData', 'sequence'],
        function getTranslationsWithAminoAcids(translations, sequence) {
            return translations.map(function(translation) {
                var translationWithAminoAcids = assign({}, translation);
                var subseq = getSequenceWithinRange(translation, sequence);
                translationWithAminoAcids.aminoAcids = getAminoAcidDataForEachBaseOfDna(subseq, translation.forward);
                return translationWithAminoAcids;
            });
        }
    ]),
    sequenceLength: monkey([
        ['sequenceData'],
        function(sequenceData) {
            return sequenceData.sequence ? sequenceData.sequence.length : 0;
        }
    ]),
    selectedSequenceString: monkey([
        ['sequenceData', 'sequence'],
        ['selectionLayer'],
        function(sequence, selectionLayer) {
            if (sequence && selectionLayer && selectionLayer.selected) {
                return getSequenceWithinRange(selectionLayer, sequence);
            } else {
                return '';
            }
        }
    ]),
    orfData: monkey([
        ['sequenceData', 'sequence'],
        ['sequenceData', 'circular'], //decide on what to call this..
        ['minimumOrfSize'],
        findOrfsInPlasmid
    ]),
    combinedSequenceData: monkey([ //holds usual sequence data, plus orfs, plus parts..
        ['sequenceData'],
        ['orfData'],
        ['translationsWithAminoAcids'],
        ['cutsites'],
        function(sequenceData, orfData, translations, cutsites) {
            return assign({}, sequenceData, {
                orfs: orfData,
                translations: translations,
                cutsites: cutsites
            });
        }
    ]),
    rowData: monkey([
        ['combinedSequenceData'],
        ['bpsPerRow'],
        function(sequenceData, bpsPerRow) {
            console.log('rowDataUpdated!');
            return prepareRowData(sequenceData, bpsPerRow);
        }
    ]),
    totalRows: monkey([
        ['rowData'],
        function(rowData) {
            if (rowData) {
                return rowData.length;
            }
        }
    ]),
    newRandomRowToJumpTo: monkey([
        ['totalRows'],
        ['rowToJumpTo'],
        function(totalRows) {
            return {
                row: Math.floor(totalRows * Math.random())
            };
        }
    ]),
});

module.exports = tree;