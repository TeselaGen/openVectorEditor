var reqContext = require.context('./actions/', false, /^((?!test).)*$/);
var a = {};
reqContext.keys().forEach(function(key) {
    a[key.substring(2)] = reqContext(key)
});

//add all the signals to the cerebral controller here
export default function registerSignals(controller) {
    //tnr:  WORKING: 
    controller.signal('copySelection', a.getData('selectionLayer'), a.copySelection);
    controller.signal('selectAll', a.selectAll, a.setSelectionLayer);
    controller.signal('sequenceDataInserted',
        a.getData('selectionLayer', 'sequenceLength', 'sequenceData'),
        a.checkLayerIsSelected, {
            success: [a.deleteSequence],
            error: [a.getData('caretPosition')]
        },
        a.insertSequenceData,
        a.setData('caretPosition', 'sequenceData'));
    controller.signal('setCutsiteLabelSelection', a.setCutsiteLabelSelection);
    controller.signal('setCaretPosition', a.setCaretPosition);
    // controller.signal('editorClicked', a.setCaretPosition, a.setSelectionLayer);
    //tnr: MOSTLY WORKING: 
    controller.signal('backspacePressed',
        a.getData('selectionLayer', 'sequenceLength', 'sequenceData'),
        a.checkLayerIsSelected, {
            success: [a.deleteSequence],
            error: [a.getData('caretPosition'), a.prepDeleteOneBack, a.deleteSequence]
        });
    controller.signal('caretMoved',
        a.getData('selectionLayer', 'caretPosition', 'sequenceLength', 'bpsPerRow'),
        a.updateCaretPosByMoveType,
        a.checkShiftHeld, {
            success: [a.checkLayerIsSelected, {
                success: [a.updateSelectionShiftHeldAndPreviousSelection, a.setSelectionLayer, a.updateOutput('updatedCaretPos', 'caretPosition'), a.setCaretPosition],
                error: [a.updateSelNoPreviousSel, a.setSelectionLayer, a.updateOutput('updatedCaretPos', 'caretPosition'), a.setCaretPosition]
            }],
            error: [a.clearSelectionLayer, a.updateOutput('updatedCaretPos', 'caretPosition'), a.setCaretPosition],
        },
    );

    //tnr: NOT YET WORKING:
    //higher priority
    controller.signal('pasteSequenceString', [a.pasteSequenceString]);
    controller.signal('setOrClearSelectionLayer', [a.setSelectionLayer]);
    // controller.signal('toggleAnnotationDisplay', [a.toggleAnnotationDisplay]); // in progress - SL

    //lower priority
    controller.signal('addAnnotations', [a.addAnnotations]);
    controller.signal('jumpToRow', [a.jumpToRow]);


}