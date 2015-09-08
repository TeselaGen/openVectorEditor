var baobab = require('baobab');
// var sequenceData = require('./sequenceData');
var sequenceData = require('./sequenceDataWithOrfsAndTranslations');
var prepareRowData = require('./prepareRowData');
var findOrfsInPlasmid = require('./findOrfsInPlasmid');
var validateAndTidyUpSequenceData = require('./validateAndTidyUpSequenceData');
var assign = require('lodash/object/assign');
var each = require('lodash/collection/each');
var getSequenceWithinRange = require('./getSequenceWithinRange');
var getAminoAcidDataForEachBaseOfDna = require('./getAminoAcidDataForEachBaseOfDna');
var getCutsitesFromSequence = require('./getCutsitesFromSequence');
var enzymeList = require('./enzymeList');

var tree = new baobab({
    rowToJumpTo: null,
    topSpacerHeight: 0,
    bottomSpacerHeight: 0,
    averageRowHeight: 100,
    charWidth: 15,
    CHAR_HEIGHT: 15,
    ANNOTATION_HEIGHT: 15,
    minimumOrfSize: 20,
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
    userEnzymeList: [
        'RspLKII',
        'Bme216I',
        'Uba1229I',
        'MaeK81I', "EspHK22I",
        "Slu1777I",
        "BshHI",
        "Ssp2I",
        "CspAI",
        "BtsI",
        "AspMI",
        "NgoEII",
        "Bsu1532I",
        "DsaI",
        "BstRI",
        "Pru2I",
        "Uba1439I",
        "BsrFI",
        "BseRI",
        "MizI",
        "HgiBI",
        "BarI",
        "NsiCI"
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
        isSelecting: false,
    },
    caretPosition: -1,
    visibleRows: {
        start: 0,
        end: 0,
    },
    sequenceData: validateAndTidyUpSequenceData(sequenceData),
    clipboardData: null,
    $bpsPerRow: [
        ['rowViewDimensions',
            'width'
        ],
        ['charWidth'],
        function(rowViewDimensionsWidth, charWidth) {
            return Math.floor(rowViewDimensionsWidth / charWidth);
        }
    ],
    $userEnzymes: [
        ['userEnzymeList'],
        function(userEnzymeList) {
            return userEnzymeList.map(function(enzymeName) {
                return enzymeList[enzymeName];
            });
        }
    ],
    $cutsitesByName: [
        ['sequenceData', 'sequence'],
        ['sequenceData', 'circular'],
        ['$userEnzymes'],
        getCutsitesFromSequence
    ],
    $cutsitesAsArray: [
        ['$cutsitesByName'],
        function (cutsitesByName) {
            var cutsitesArray = [];
            Object.keys(cutsitesByName).forEach(function (key) {
                cutsitesArray.concat(cutsitesByName[key]);
            });
            return cutsitesArray;
        }
    ],
    $translationsWithAminoAcids: [
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
    ],
    $sequenceLength: [
        ['sequenceData'],
        function(sequenceData) {
            return sequenceData.sequence ? sequenceData.sequence.length : 0;
        }
    ],
    $selectedSequenceString: [
        ['sequenceData', 'sequence'],
        ['selectionLayer'],
        function(sequence, selectionLayer) {
            if (sequence && selectionLayer && selectionLayer.selected) {
                return getSequenceWithinRange(selectionLayer, sequence);
            } else {
                return '';
            }
        }
    ],
    $orfData: [
        ['sequenceData', 'sequence'],
        ['sequenceData', 'circular'], //decide on what to call this..
        ['minimumOrfSize'],
        findOrfsInPlasmid
    ],
    $combinedSequenceData: [ //holds usual sequence data, plus orfs, plus parts..
        ['sequenceData'],
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
    $newRandomRowToJumpTo: [
        ['$totalRows'],
        ['rowToJumpTo'],
        function(totalRows) {
            return {
                row: Math.floor(totalRows * Math.random())
            };
        }
    ],
});

module.exports = tree;