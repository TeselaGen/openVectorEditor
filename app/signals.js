//tnr: little webpack trick to require all the action files and add them to the 'a' object
var reqContext = require.context('./actions/', true, /^((?!test).)*$/);
var a = {};
reqContext.keys().forEach(function(key) {
    a[key.substring(2)] = reqContext(key)
});

// if same sidebar toggle is hit twice the sidebar opens and closes
// toggling a different sidebar closes the current and opens that sidebar
var showSidebar = function(input, tree, output) {
    var currentSidebar = tree.get('showSidebar')
    if (!currentSidebar) {
        tree.set('showSidebar', input.currentSidebar)
    } else {
        if(currentSidebar === input.currentSidebar) {
            tree.set('showSidebar', '') //an empty string evaluates false so sidebar isn't shown
        } else {
            tree.set('showSidebar', input['currentSidebar'])
        }
    }
}
//add all the signals to the cerebral controller here
export default function registerSignals(controller, options) {
    //tnr:  WORKING: 
    controller.signal('sidebarToggled', [showSidebar]);

    controller.signal('copySelection', [a.getData('selectionLayer', 'sequenceData'), a.copySelection, {
        success: a.setData('clipboardData'),
        error: [] //tnr: we should probably have some sort of generic info/warning message that we can display when things go wrong
    }]);
    controller.signal('selectAll', [a.selectAll, a.setSelectionLayer]);
    controller.signal('selectInverse', [a.selectInverse, a.setSelectionLayer]);
    controller.signal('sequenceDataInserted', [
        a.getData('selectionLayer', 'sequenceLength', 'sequenceData'),
        a.checkLayerIsSelected, {
            selected: [a.deleteSequence],
            notSelected: [a.getData('caretPosition')]
        },
        a.insertSequenceData,
        a.setData('caretPosition', 'sequenceData')
    ]);
    controller.signal('setCutsiteLabelSelection', [a.setCutsiteLabelSelection]);
    controller.signal('setCaretPosition', [a.setCaretPosition]);
    // SL: working but may need to be more robust
    controller.signal('toggleAnnotationDisplay', [a.toggleAnnotationDisplay]);

    //tnr: MOSTLY WORKING: 
    controller.signal('backspacePressed', [
        a.getData('selectionLayer', 'sequenceLength', 'sequenceData'),
        a.checkLayerIsSelected, {
            selected: [a.deleteSequence],
            notSelected: [a.getData('caretPosition'), a.prepDeleteOneBack, a.deleteSequence]
        }
    ]);
    controller.signal('editorClicked', [
        a.getData('selectionLayer', 'sequenceLength', 'bpsPerRow', 'caretPosition'),
        a.checkShiftHeld, {
            shiftHeld: [a.checkLayerIsSelected, {
                selected: [a.updateSelectionShiftClick, a.setSelectionLayer],
                notSelected: [a.createSelectionShiftClick, {
                    updateSelection: [a.setSelectionLayer],
                    doNothing: []
                }]
            }],
            shiftNotHeld: [a.clearSelectionLayer, a.updateOutput('updatedCaretPos', 'caretPosition'), a.setCaretPosition],
        }
    ]);
    var selectAnnotation = [
        a.getData('selectionLayer', 'sequenceLength', 'bpsPerRow', 'caretPosition'),
        a.checkShiftHeld, {
            shiftHeld: [a.checkLayerIsSelected, {
                selected: [a.updateSelectionShiftClick, a.setSelectionLayer],
                notSelected: [a.createSelectionShiftClick, {
                    updateSelection: [a.setSelectionLayer],
                    doNothing: []
                }]
            }],
            shiftNotHeld: [a.updateOutput('annotation', 'selectionLayer'), a.setSelectionLayer],
        }
    ]

    controller.signal('featureClicked', selectAnnotation);
    controller.signal('orfClicked', selectAnnotation);

    controller.signal('caretMoved', [
        a.getData('selectionLayer', 'caretPosition', 'sequenceLength', 'bpsPerRow', {
            path: ['sequenceData', 'circular'],
            name: 'circular'
        }),
        a.moveCaret,
        a.handleCaretMoved, {
            caretMoved: [a.clearSelectionLayer, a.setCaretPosition],
            selectionUpdated: [a.setSelectionLayer],
        }
    ]);


    //tnr: NOT YET WORKING:
    //higher priority
    controller.signal('pasteSequenceString', [a.pasteSequenceString]);
    controller.signal('setSelectionLayer', [a.setSelectionLayer]);

    //lower priority
    controller.signal('addAnnotations', [a.addAnnotations]);
    controller.signal('jumpToRow', [a.jumpToRow]);


}