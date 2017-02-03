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
var commonEnzymes = ["AatII", "AvrII", "BamHI", "BglII", "BsgI", "EagI", "EcoRI", "EcoRV", "HindIII", "KpnI", "NcoI", "NdeI", "NheI", "NotI", "PstI", "PvuI", "SacI", "SacII", "SalI", "SmaI", "SpeI", "SphI", "XbaI", "XhoI", "XmaI"];
// {{}} need the rebase set
// REBASE group (it's real big)

// Berkeley BioBricks
var berkeleyBBEnzymes = ["EcoRI", "BglII", "BamHI", "XhoI"];
// MIT BioBricks
var MITBBEnzymes = ["EcoRI", "XbaI", "SpeI", "PstI"];
// fermentas fast digest enzymes - this one's really long
var fastDigestEnzymes = ["AatII", "Acc65I", "AccI", "AciI", "AclI", "AcuI", "AfeI", "AflII", "AgeI", "AjuI", "AleI", "AluI", "Alw21I", "Alw26I", "AlwNI", "ApaI", "ApaLI", "AscI", "AseI", "AsiSI", "AvaI", "AvaII", "AvrII", "BamHI", "BanI", "BbsI", "BbvI", "BclI", "BfaI", "BglI", "BglII", "BlpI", "Bme1580I", "BmtI", "BplI", "BpmI", "Bpu10I", "BsaAI", "BsaBI", "BsaHI", "BsaJI", "BseGI", "BseNI", "BseXI", "Bsh1236I", "BsiEI", "BsiWI", "BslI", "BsmBI", "BsmFI", "Bsp119I", "Bsp120I", "Bsp1286I", "Bsp1407I", "BspCNI", "BspHI", "BspMI", "BsrBI", "BsrDI", "BsrFI", "BssHII", "BstXI", "BstZ17I", "Bsu36I", "ClaI", "Csp6I", "DdeI", "DpnI", "DraI", "DraIII", "DrdI", "EagI", "Eam1105I", "EarI", "Ecl136II", "Eco31I", "Eco91I", "EcoNI", "EcoO109I", "EcoRI", "EcoRV", "EheI", "Fnu4HI", "FokI", "FspAI", "FspI", "HaeII", "HaeIII", "HgaI", "HhaI", "HincII", "HindIII", "HinfI", "HinP1I", "HpaI", "HpaII", "Hpy8I", "HpyF10VI", "Kpn2I", "KpnI", "MauBI", "MboI", "MboII", "MfeI", "MluI", "MlyI", "MnlI", "MreI", "MscI", "MseI", "MslI", "MspI", "MssI", "Mva1269I", "MvaI", "NaeI", "NciI", "NcoI", "NdeI", "NheI", "NlaIII", "NlaIV", "NmuCI", "NotI", "NruI", "NsiI", "NspI", "PacI", "PdmI", "PflMI", "PfoI", "PmlI", "PpuMI", "PshAI", "PsiI", "PspFI", "PstI", "PsuI", "PsyI", "PvuI", "PvuII", "RsaI", "RsrII", "SacI", "SalI", "SanDI", "SapI", "Sau3AI", "Sau96I", "SbfI", "ScaI", "ScrFI", "SexAI", "SfaNI", "SfcI", "SfiI", "SmaI", "SnaBI", "SpeI", "SphI", "SspI", "StuI", "StyI", "SwaI", "TaaI", "TaiI", "TaqI", "TatI", "TauI", "TfiI", "Tru1I", "Tsp509I", "TspRI", "XapI", "XbaI", "XhoI"];

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
    addEnzymeButtonValue: 'add',
    addAllEnzymesButtonValue: 'add all',
    removeEnzymeButtonValue: 'remove',
    removeAllEnzymesButtonValue: 'remove all',
    cancelButtonValue: 'Cancel',
    applyButtonValue: 'Apply',
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
        id: -1,
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
    history: [],
    userEnzymeList: commonEnzymes, //user enzymes applied to the view
    commonEnzymes: commonEnzymes,
    berkeleyBBEnzymes: berkeleyBBEnzymes,
    MITBBEnzymes: MITBBEnzymes,
    fastDigestEnzymes: fastDigestEnzymes,
    currentEnzymesList: commonEnzymes, //chosen enzymes list to show under enzymes groups
    originalUserEnzymesList: commonEnzymes, //state of user enzymes list at the moment when RestrictionEnzymeManager was opened
    currentUserEnzymesList: commonEnzymes, //edited, not saved list of active enzymes
    viewportDimensions: {
        height: 500,
        width: 500
    },
    // derived data - can't alphabetize because of dependencies  :(
    bpsPerRow: deriveData([
        ['rowViewDimensions', 'width'],
        ['charWidth'],
        ['showCircular'],
        ['showRow'],
        function(rowViewDimensionsWidth, charWidth, showCircular, showRow) {
            // var charsInRow = Math.floor(rowViewDimensionsWidth / charWidth);
            // var gaps = Math.floor(charsInRow / 10) - 1;
            // return Math.floor((charsInRow - gaps) / 10) * 10;
            // return charsInRow;
            // if(showCircular && showRow) {
                return 45;
            // } else {
            //     return 90;
            // }
        }
    ]),
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
        function(combinedSequenceData) {
            return prepareCircularViewData(combinedSequenceData);
        }
    ]),
    circularAndLinearTickSpacing: deriveData([
        ['sequenceLength'],
        function(sequenceLength) {
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
