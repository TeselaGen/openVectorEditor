var reqContext = require.context('./actions/', false, /^((?!test).)*$/);
var a = {};
reqContext.keys().forEach(function(key) {
    a[key.substring(2)] = reqContext(key)
});

//add all the signals to the cerebral controller here
export default function registerSignals(controller) {
    //tnr:  WORKING: 
    controller.signal('copySelection', a.getSelectionLayer, a.copySelection);
    controller.signal('selectAll', a.selectAll, a.setSelectionLayer);
    controller.signal('sequenceDataInserted', 
        a.getSelectionLayer, {
            success: [a.deleteSequence]
        }, a.getCaretPosition, a.insertSequenceData); 
    controller.signal('setCutsiteLabelSelection', a.setCutsiteLabelSelection);
    controller.signal('setCaretPosition', a.setCaretPosition);
    controller.signal('editorClicked', a.setCaretPosition, a.setSelectionLayer);
    //tnr: MOSTLY WORKING: 
    controller.signal('backspacePressed', a.getSelectionLayer, {
        success: [a.deleteSequence],
        error: [a.getCaretPosition, a.prepDeleteOneBack, a.deleteSequence]
    });
    controller.signal('caretMoved', 
        a.getData('selectionLayer'),
        a.getCaretPosition,
        // a.getSequenceLength,
        a.getData('sequenceLength'),
        a.checkCaretMoveType, {
            shiftHeld: [a.moveCaretShiftHeld, a.setSelectionLayer],
            noShift: [a.moveCaretNoShift, a.clearSelectionLayer]
        },
    );

    //tnr: NOT YET WORKING:
    //higher priority
    controller.signal('pasteSequenceString', a.pasteSequenceString);
    controller.signal('setSelectionLayer', a.setSelectionLayer);
    controller.signal('toggleAnnotationDisplay', a.setCaretPosition);

    //lower priority
    controller.signal('addAnnotations', a.addAnnotations);
    controller.signal('jumpToRow', a.jumpToRow);


}