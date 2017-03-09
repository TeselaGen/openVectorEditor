var deriveData = require('baobab').monkey
var prepareRowData = require('ve-sequence-utils/prepareRowData');
var prepareCircularViewData = require('ve-sequence-utils/prepareCircularViewData');
var findOrfsInPlasmid = require('ve-sequence-utils/findOrfsInPlasmid');
var assign = require('lodash/object/assign');
var getSequenceWithinRange = require('ve-range-utils/getSequenceWithinRange');
var getAminoAcidDataForEachBaseOfDna = require('ve-sequence-utils/getAminoAcidDataForEachBaseOfDna');
var getCutsitesFromSequence = require('ve-sequence-utils/getCutsitesFromSequence');

// this isn't loading, it's using the hardcoded version below but this line is still necessary
var enzymeList = require('ve-sequence-utils/enzymeList.json');

// here's the enzyme lists from old VE so we can pick and choose / merge them
const COMMON_ENZYMES = require('../constants/common-enzymes');
const FAST_DIGEST = require('../constants/fermentas-fast-enzymes');
const REBASE = require('../constants/rebase-enzymes');
const BERKELEY_BB = require('../constants/berkeley-biobrick-enzymes');
const MIT_BB = require('../constants/mit-biobrick-enzymes');

module.exports = {
    // simple vars
    allowPartialAnnotationsOnCopy: false,
    annotationHeight: 4,
    averageRowHeight: 100,
    bottomSpacerHeight: 0,
    caretPosition: 0,
    charHeight: 15,
    charWidth: 25,
    clipboardData: null,
    embedded: true,
    mapViewTickSpacing: 40,
    minimumOrfSize: 300,
    readOnly: true,
    rowToJumpTo: null,
    sequenceHeight: 20,
    showAddFeatureModal: false,
    showAxis: true,
    showCircular: true,
    showCutsites: false,
    showFeatures: true,
    showLinear: true,
    showOrfModal: false,
    showOrfs: false,
    showParts: true,
    showRestrictionEnzymeManager: false,
    showReverseSequence: true,
    showRow: true,
    showSequence: true,
    showSidebar: false,
    showTranslations: false,
    sidebarType: 'Features',
    spaceBetweenAnnotations: 3,
    tickSpacing: 10,
    topSpacerHeight: 0,
    uppercase: true,
    // complex vars
    circularViewDimensions: {
        height: 500,
        width: 500
    },
    cutsiteLabelSelectionLayer: {
        start: -1,
        end: -1,
        selected: false,
        cursorAtEnd: true
    },
    editorDrag: {
        inProgress: false,
        initiatedByGrabbingCaret: false,
        bpOfFixedCaretPosition: 0,
    },
    history: [],
    // mapViewDimensions: {
    //     height: 500,
    //     width: 500
    // },
    // rowViewDimensions: {
    //     height: 500,
    //     width: 500
    // },
    searchLayers: [],
    selectionLayer: {
        start: -1,
        end: -1,
        id: -1,
        selected: false,
        cursorAtEnd: true
    },
    sequenceData: { // sequence data gets passed in and overrides this object
       sequence: '',
       features: [],
       translations: [],
       parts: [],
       circular: false
    },
    // (()) why so many vars
    userEnzymeList: COMMON_ENZYMES, //user enzymes applied to the view
    commonEnzymes: COMMON_ENZYMES,
    berkeleyBBEnzymes: BERKELEY_BB,
    MITBBEnzymes: MIT_BB,
    fastDigestEnzymes: FAST_DIGEST,
    rebaseEnzymes: REBASE,
    currentEnzymesList: COMMON_ENZYMES, //chosen enzymes list to show under enzymes groups
    originalUserEnzymesList: COMMON_ENZYMES, //state of user enzymes list at the moment when RestrictionEnzymeManager was opened
    currentUserEnzymesList: COMMON_ENZYMES, //edited, not saved list of active enzymes
    // viewportDimensions: {
    //     height: 500,
    //     width: 500
    // },
    // derived data - can't alphabetize because of dependencies  :(
    bpsPerRow: 10,
    userEnzymes: deriveData([
        ['userEnzymeList'],
        function(userEnzymeList) {
            return userEnzymeList.map(function(enzymeName) {
                return enzymeList[enzymeName.toLowerCase()];
            });
        }
    ]),
    cutsitesByName: deriveData([
        ['sequenceData', 'sequence'],
        ['sequenceData', 'circular'],
        ['userEnzymes'],
        getCutsitesFromSequence
    ]),
    cutsites: deriveData([
        ['cutsitesByName'],
        function (cutsitesByName) {
            var cutsites = [];
            Object.keys(cutsitesByName).forEach(function (key) {
                cutsites = cutsites.concat(cutsitesByName[key]);
            });

            var cutsitesArray = [];
            for (let i = 0; i < cutsites.length; i++) {
                var cutsite = Object.assign({}, cutsites[i])
                cutsite.id = i;
                cutsite.name = cutsite.restrictionEnzyme.name;
                cutsite.numberOfCuts = cutsitesByName[cutsite.restrictionEnzyme.name].length;
                cutsitesArray.push(cutsite);
            }
            return cutsitesArray;
        }
    ]),
    translationsWithAminoAcids: deriveData([
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
    sequenceLength: deriveData([
        ['sequenceData'],
        function(sequenceData) {
            return sequenceData.sequence ? sequenceData.sequence.length : 0;
        }
    ]),
    // mapViewCharWidth: deriveData([
    //     ['mapViewDimensions',
    //         'width'
    //     ],
    //     ['sequenceLength'],
    //     function(mapViewDimensionsWidth, sequenceLength) {
    //         return mapViewDimensionsWidth / sequenceLength;
    //     }
    // ]),
    selectedSequenceString: deriveData([
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
    selectedSeqMeltingTemp: deriveData([
        ['selectedSequenceString'],
        function(selectedSequenceString) {
            //{{}} we need to actually implement/find an algorithm to calculate melting temp
            return selectedSequenceString.length * 10
        }
    ]),
    orfData: deriveData([
        ['sequenceData', 'sequence'],
        ['sequenceData', 'circular'], //decide on what to call this..
        ['minimumOrfSize'],
        findOrfsInPlasmid
    ]),
    combinedSequenceData: deriveData([ //holds usual sequence data, plus orfs, plus parts..
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
    rowData: deriveData([
        ['combinedSequenceData'],
        ['bpsPerRow'],
        function(sequenceData, bpsPerRow) {
            return prepareRowData(sequenceData, bpsPerRow);
        }
    ]),
    // mapViewRowData: deriveData([
    //     ['combinedSequenceData'],
    //     ['sequenceLength'],
    //     function(sequenceData, sequenceLength) {
    //         return prepareRowData(sequenceData, sequenceLength);
    //     }
    // ]),
    circularViewData: deriveData([
        ['combinedSequenceData'],
        function(combinedSequenceData) {
            return prepareCircularViewData(combinedSequenceData);
        }
    ]),
    // circularAndLinearTickSpacing: deriveData([
    //     ['sequenceLength'],
    //     function(sequenceLength) {
    //         var a = Math.ceil(sequenceLength / 100) * 10;
    //         return a
    //     }
    // ]),
    totalRows: deriveData([
        ['rowData'],
        function(rowData) {
            if (rowData) {
                return rowData.length;
            }
        }
    ]),
    newRandomRowToJumpTo: deriveData([
        ['totalRows'],
        ['rowToJumpTo'],
        function(totalRows) {
            return {
                row: Math.floor(totalRows * Math.random())
            };
        }
    ]),
};
