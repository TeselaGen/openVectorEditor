//tnr: little webpack trick to require all the action files and add them to the 'a' object
var reqContext = require.context('./actions/', false, /^((?!test).)*$/);
var a = {};
reqContext.keys().forEach(function(key) {
    a[key.substring(2)] = reqContext(key)
});

//add all the signals to the cerebral controller here
export default function registerSignals(controller) {
    //tnr:  WORKING: 
    controller.signal('copySelection', [a.getData('selectionLayer', 'sequenceData'), a.copySelection, {
        success: a.setData('clipboardData'),
        error: [] //tnr: we should probably have some sort of generic info/warning message that we can display when things go wrong
    }]);
    controller.signal('selectAll', [a.selectAll, a.setSelectionLayer]);
    controller.signal('sequenceDataInserted', [
        a.getData('selectionLayer', 'sequenceLength', 'sequenceData'),
        a.checkLayerIsSelected, {
            success: [a.deleteSequence],
            error: [a.getData('caretPosition')]
        },
        a.insertSequenceData,
        a.setData('caretPosition', 'sequenceData')
    ]);
    controller.signal('setCutsiteLabelSelection', [a.setCutsiteLabelSelection]);
    controller.signal('setCaretPosition', [a.setCaretPosition]);
    // SL: working but may need to be more robust
    controller.signal('toggleAnnotationDisplay', [a.toggleAnnotationDisplay]);
    // controller.signal(]'editorClicked', [ a.setCaretPosition, a.setSelectionLayer);
    //tnr: MOSTLY WORKING: 
    controller.signal('backspacePressed', [
        a.getData('selectionLayer', 'sequenceLength', 'sequenceData'),
        a.checkLayerIsSelected, {
            success: [a.deleteSequence],
            error: [a.getData('caretPosition'), a.prepDeleteOneBack, a.deleteSequence]
        }
    ]);
    controller.signal('caretMoved', [
        a.getData('selectionLayer', 'caretPosition', 'sequenceLength', 'bpsPerRow'),
        a.updateCaretPosByMoveType,
        a.checkShiftHeld, {
            success: [a.checkLayerIsSelected, {
                success: [a.updateSelShiftHeldAndPreviousSel, a.setSelectionLayer, a.updateOutput('updatedCaretPos', 'caretPosition'), a.setCaretPosition],
                error: [a.updateSelNoPreviousSel, a.setSelectionLayer, a.updateOutput('updatedCaretPos', 'caretPosition'), a.setCaretPosition]
            }],
            error: [a.clearSelectionLayer, a.updateOutput('updatedCaretPos', 'caretPosition'), a.setCaretPosition],
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