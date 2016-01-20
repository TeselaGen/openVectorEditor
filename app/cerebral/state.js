var deriveData = require('baobab').monkey
var prepareRowData = require('ve-sequence-utils/prepareRowData');
var prepareCircularViewData = require('ve-sequence-utils/prepareCircularViewData');
var findOrfsInPlasmid = require('ve-sequence-utils/findOrfsInPlasmid');

var assign = require('lodash/object/assign');
var getSequenceWithinRange = require('ve-range-utils/getSequenceWithinRange');
var getAminoAcidDataForEachBaseOfDna = require('ve-sequence-utils/getAminoAcidDataForEachBaseOfDna');
var getCutsitesFromSequence = require('ve-sequence-utils/getCutsitesFromSequence');
//tnr: this json file is being loaded with a special json webpack loader. it will break if run from another environment (eg. node, browserify)
var enzymeList = require('ve-sequence-utils/enzymeList.json'); 

module.exports = {
    //sl: begin obsessive alphabetization   :p
    // simple vars
    allowPartialAnnotationsOnCopy: false,
    annotationHeight: 15,
    averageRowHeight: 100,
    bottomSpacerHeight: 0,
    caretPosition: 0,
    charHeight: 15,
    charWidth: 15,
    clipboardData: null,
    mapViewTickSpacing: 40,
    minimumOrfSize: 20,
    readOnly: false,
    rowToJumpTo: null,
    showAxis: true,
    showCircular: true,
    showCutsites: true,
    showFeatures: true,
    showLinear: true,
    showOrfs: true,
    showParts: true,
    showReverseSequence: true,
    showRow: true,
    showSequence: true,
    showSidebar: '',
    showTranslations: true,
    spaceBetweenAnnotations: 3,
    tickSpacing: 10,
    topSpacerHeight: 0,
    uppercase: false,
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
    mapViewDimensions: {
        height: 500,
        width: 500
    },
    rowViewDimensions: {
        height: 500,
        width: 500
    },
    searchLayers: [],
    selectionLayer: {
        start: -1,
        end: -1,
        selected: false,
        cursorAtEnd: true
    },
    sequenceData: {//tnr: sequence data gets passed in and overrides this object
       sequence: '',
       features: [],
       translations: [],
       parts: [],
       circular: false
    }, 
    userEnzymeList: [
        'rsplkii',
        'bme216i',
        'uba1229i',
        'ecl37i'
    ],
    viewportDimensions: {
        height: 500,
        width: 500
    },
    visibleRows: {
        start: 0,
        end: 0
    },
    // derived data - can't alphabetize because of dependencies  :(
    bpsPerRow: deriveData([
        ['rowViewDimensions',
            'width'
        ],
        ['charWidth'],
        function(rowViewDimensionsWidth, charWidth) {
            return Math.floor(rowViewDimensionsWidth / charWidth);
        }
    ]),  
    userEnzymes: deriveData([
        ['userEnzymeList'],
        function(userEnzymeList) {
            return userEnzymeList.map(function(enzymeName) {
                return enzymeList[enzymeName];
            });
        }
    ]),
    cutsitesByName: deriveData([
        ['sequenceData', 'sequence'],
        ['sequenceData', 'circular'],
        ['userEnzymes'],
        // function (argument) {
        //     return {}
        // }
        getCutsitesFromSequence
    ]),
    cutsites: deriveData([
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
    mapViewCharWidth: deriveData([
        ['mapViewDimensions',
            'width'
        ],
        ['sequenceLength'],
        function(mapViewDimensionsWidth, sequenceLength) {
            return mapViewDimensionsWidth / sequenceLength;
        }
    ]),
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
            //tnr: we need to actually implement/find an algorithm to calculate melting temp
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
    mapViewRowData: deriveData([
        ['combinedSequenceData'],
        ['sequenceLength'],
        function(sequenceData, sequenceLength) {
            return prepareRowData(sequenceData, sequenceLength);
        }
    ]),
    circularViewData: deriveData([
        ['combinedSequenceData'],
        function(combinedSequenceData, ) {
            return prepareCircularViewData(combinedSequenceData);
        }
    ]),
    circularAndLinearTickSpacing: deriveData([
        ['sequenceLength'],
        function(sequenceLength, ) {
            var a = Math.ceil(sequenceLength / 100) * 10;
            return a
        }
    ]),
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
