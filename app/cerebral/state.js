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
var commonEnzymes = ["aatii", "avrii", "bamhi", "bglii", "bsgi", "eagi", "ecori", "ecorv", "hindiii", "kpni", "ncoi", "ndei", "nhei", "noti", "psti", "pvui", "saci", "sacii", "sali", "smai", "spei", "sphi", "xbai", "xhoi", "xmai"];
// {{}} need the rebase set
// Berkeley BioBricks
var berkeleyBBEnzymes = ["ecori", "bglii", "bamhi", "xhoi"];
// MIT BioBricks
var MITBBEnzymes = ["ecori", "xbai", "spei", "psti"];
// fermentas fast digest enzymes - this one's really really really long and doesnt work right now!
var fastDigestEnzymes = ["aatii", "acc65i", "acci", "acii", "acli", "acui", "afei", "aflii", "agei", "ajui", "alei", "alui", "alw21i", "alw26i", "alwni", "apai", "apali", "asci", "asei", "asisi", "avai", "avaii", "avrii", "bamhi", "bani", "bbsi", "bbvi", "bcli", "bfai", "bgli", "bglii", "blpi", "bme1580i", "bmti", "bpli", "bpmi", "bpu10i", "bsaai", "bsabi", "bsahi", "bsaji", "bsegi", "bseni", "bsexi", "bsh1236i", "bsiei", "bsiwi", "bsli", "bsmbi", "bsmfi", "bsp119i", "bsp120i", "bsp1286i", "bsp1407i", "bspcni", "bsphi", "bspmi", "bsrbi", "bsrdi", "bsrfi", "bsshii", "bstxi", "bstz17i", "bsu36i", "clai", "csp6i", "ddei", "dpni", "drai", "draiii", "drdi", "eagi", "eam1105i", "eari", "ecl136ii", "eco31i", "eco91i", "econi", "ecoo109i", "ecori", "ecorv", "ehei", "fnu4hi", "foki", "fspai", "fspi", "haeii", "haeiii", "hgai", "hhai", "hincii", "hindiii", "hinfi", "hinp1i", "hpai", "hpaii", "hpy8i", "hpyf10vi", "kpn2i", "kpni", "maubi", "mboi", "mboii", "mfei", "mlui", "mlyi", "mnli", "mrei", "msci", "msei", "msli", "mspi", "mssi", "mva1269i", "mvai", "naei", "ncii", "ncoi", "ndei", "nhei", "nlaiii", "nlaiv", "nmuci", "noti", "nrui", "nsii", "nspi", "paci", "pdmi", "pflmi", "pfoi", "pmli", "ppumi", "pshai", "psii", "pspfi", "psti", "psui", "psyi", "pvui", "pvuii", "rsai", "rsrii", "saci", "sali", "sandi", "sapi", "sau3ai", "sau96i", "sbfi", "scai", "scrfi", "sexai", "sfani", "sfci", "sfii", "smai", "snabi", "spei", "sphi", "sspi", "stui", "styi", "swai", "taai", "taii", "taqi", "tati", "taui", "tfii", "tru1i", "tsp509i", "tspri", "xapi", "xbai", "xhoi"];

module.exports = {
    // simple vars
    allowPartialAnnotationsOnCopy: false,
    annotationHeight: 4,
    averageRowHeight: 100,
    bottomSpacerHeight: 0,
    caretPosition: 0,
    charHeight: 15,
    charWidth: 15,
    clipboardData: null,
    embedded: true,
    mapViewTickSpacing: 40,
    minimumOrfSize: 300,
    readOnly: true,
    rowToJumpTo: null,
    showAxis: true,
    showCircular: true,
    showCutsites: false,
    showFeatures: true,
    showLinear: true,
    showOrfs: false,
    showParts: true,
    showReverseSequence: true,
    showRow: true,
    showSequence: true,
    showSidebar: false,
    showTranslations: false,
    showRestrictionEnzymeManager: false,
    sidebarType: 'Features',
    spaceBetweenAnnotations: 3,
    tickSpacing: 10,
    topSpacerHeight: 0,
    uppercase: true,
    // complex vars
    circularViewDimensions: {
        height: 700,
        width: 700
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
    userEnzymeList: commonEnzymes,
    commonEnzymes: commonEnzymes,
    berkeleyBBEnzymes: berkeleyBBEnzymes,
    MITBBEnzymes: MITBBEnzymes,
    fastDigestEnzymes: fastDigestEnzymes,
    currentEnzymesList: commonEnzymes,
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
            var charsInRow = Math.floor(rowViewDimensionsWidth / charWidth);
            var gaps = Math.floor(charsInRow / 10) - 1;
            return Math.floor((charsInRow - gaps) / 10) * 10;
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
        getCutsitesFromSequence
    ]),
    cutsites: deriveData([
        ['cutsitesByName'],
        function (cutsitesByName) {
            var cutsitesArray = [];
            Object.keys(cutsitesByName).forEach(function (key) {
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
