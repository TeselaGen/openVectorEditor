//tnr: little webpack trick to require all the action files and add them to the 'a' object
var reqContext = require.context('./actions/', true, /^((?!test).)*$/);
var a = {};
reqContext.keys().forEach(function(key) {
    a[key.substring(2)] = reqContext(key)
});
//tnr: little webpack trick to require all the action chain files and add them to the 'c' object
var reqContext = require.context('./chains/', true, /^((?!test).)*$/);
var c = {};
reqContext.keys().forEach(function(key) {
    c[key.substring(2)] = reqContext(key)
});
import assign from 'lodash/object/assign'
var each = require('lodash/collection/each');
export default function(options) {

    a = assign({}, a, options.actions) //override any actions here!

    var signals = {
        /* These should be in alphabetical order and are split into edit-only 
        and general (read or edit) signals 
        Unused or broken signals are edited out */

        addFeatureModalDisplay: [
            a.addFeatureModalDisplay
        ],

        adjustWidth: [
            a.adjustWidth
        ],

        caretMoved: [
            a.getData('selectionLayer', 'caretPosition', 'sequenceLength', 'bpsPerRow', {
                path: ['sequenceData', 'circular'],
                name: 'circular'
            }),

            a.moveCaret,
            a.handleCaretMoved, {
                caretMoved: [a.clearSelectionLayer, a.setCaretPosition],
                selectionUpdated: [a.setSelectionLayer],
            }
        ],

        changeOrfMin: [
            a.changeOrfMin
        ],

        chooseEnzymeList: [
            a.showSelectedEnzymeList
        ],

        // there's weird bracketing here to deal with the async superagent request
        clickLoadFile: [
            [a.loadFromFile], {
                success: [a.insertSequenceData],
                error: []
            }
        ],

        // copySelection: [ // earavina: not used for now
        //     a.copySelection, {
        //         success: [a.setData('clipboardData')],
        //         error: [] //tnr: we should probably have some sort of generic info/warning message that we can display when things go wrong
        //     }
        // ],

        cutsiteClicked: c.selectAnnotation(a),

        editorClicked: [
            a.checkBooleanState(['editorDrag', 'inProgress']), {
                success: [], //do nothing
                error: [a.getData('selectionLayer', 'sequenceLength', 'bpsPerRow', 'caretPosition'),
                    a.checkShiftHeld, {
                        shiftHeld: [a.checkLayerIsSelected, {
                            selected: [a.updateSelectionShiftClick, a.setSelectionLayer],
                            notSelected: [a.createSelectionShiftClick, {
                                updateSelection: [a.setSelectionLayer],
                                doNothing: []
                            }]
                        }],
                        shiftNotHeld: [a.clearSelectionLayer, a.updateOutput('nearestBP', 'caretPosition'), a.setCaretPosition],
                    }
                ]
            }
        ],

        editorDragged: [
            a.handleEditorDragged, {
                caretMoved: [a.clearSelectionLayer, a.setCaretPosition],
                selectionUpdated: [a.setSelectionLayer],
            }
        ],

        editorDragStarted: [
            a.handleEditorDragStarted
        ],

        editorDragStopped: [
            [function pause ({input, state, output}) {
                // {{}} async function that doesn't do anything
                setTimeout(function () {
                    output()
                },0)
            }],
            a.handleEditorDragStopped
        ],

        editUserEnzymes: [
            a.editUserEnzymes
        ],

        featureClicked: c.selectAnnotation(a),

        jumpToRow: [
            a.jumpToRow
        ],

        orfClicked: c.selectAnnotation(a),

        restrictionEnzymeManagerDisplay: [
            a.restrictionEnzymeManagerDisplay
        ],

        searchSequence: [
            a.searchSequence,
            a.updateSearchLayers
        ],

        selectAll: [
            a.selectAll,
            a.setSelectionLayer
        ],

        selectInverse: [
            a.selectInverse,
            a.setSelectionLayer
        ],

        // setCutsiteLabelSelection:[
        //     a.setCutsiteLabelSelection
        // ],

        setSelectionLayer: [
            a.setSelectionLayer
        ],

        setTreeVal: [
            a.setData
        ],

        showChangeMinOrfSizeDialog: [
            a.showChangeMinOrfSizeDialog
        ],

        sidebarDisplay: [
            a.sidebarDisplay
        ],

        sidebarToggle: [
            a.sidebarToggle
        ],

        toggleAnnotationDisplay: [
            a.toggleAnnotationDisplay
        ],

        toggleSearchBar: [
            a.toggleSearchBar
        ],
        toggleShowCircular: [
            a.toggleShowCircular
        ],
        toggleShowRow: [
            a.toggleShowRow
        ],

        updateHistory: [
            a.updateHistory
        ],

        updateUserEnzymes: [
            a.updateUserEnzymes
        ],

    // ///////////////////////////////////
    // edit only actions

        addAnnotations: [
            a.addAnnotations
        ],

        backspacePressed: a.addEditModeOnly([
            a.checkLayerIsSelected, {
                selected: [a.deleteSequence],
                notSelected: [a.prepDeleteOneBack, a.deleteSequence]
            }
        ]),

        clickSaveFile: [
            a.saveToFile
        ],

        deleteFeatures: a.addEditModeOnly([
            a.deleteFeatures
        ]),

        pasteSequenceString: a.addEditModeOnly([
            a.pasteSequenceString, {
                success: [
                    a.checkLayerIsSelected, {
                        selected: [a.deleteSequence],
                        notSelected: [a.getData('caretPosition')]
                    },
                    a.insertSequenceData
                ],
                error: [a.displayError]
            },
            a.clearSelectionLayer
        ]),

        saveChanges: [
            a.saveToServer,
        ],

        sequenceDataInserted: a.addEditModeOnly([
            a.checkLayerIsSelected, {
                selected: [a.deleteSequence],
                notSelected: [a.getData('caretPosition')]
            },
            a.insertSequenceData,
            a.clearSelectionLayer
        ]),

        updateFeature: a.addEditModeOnly([
            a.updateFeature
        ])
    }

    return assign({}, signals, options.signals)
}
