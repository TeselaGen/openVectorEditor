var reqContext = require.context('./actions/', false, /^((?!test).)*$/);
var a = {};
reqContext.keys().forEach(function(key) {
    a[key.substring(2)] = reqContext(key)
});

//add all the signals to the cerebral controller here
export default function registerSignals(controller) {
    //tnr:  WORKING: 
    controller.signal('copySelection', a.getSelectionLayer, a.copySelection);
    controller.signal('selectAll', a.selectAll, a.setOrClearSelectionLayer);
    controller.signal('sequenceDataInserted', 
        a.getSelectionLayer, {
            success: [a.deleteSequence]
        }, a.getCaretPosition, a.insertSequenceData); 
    controller.signal('setCutsiteLabelSelection', a.setCutsiteLabelSelection);
    controller.signal('editorClicked', a.setCaretPosition, a.setOrClearSelectionLayer);
    controller.signal('setCaretPosition', a.setCaretPosition);
    //tnr: MOSTLY WORKING: 
    controller.signal('backspacePressed', a.getSelectionLayer, {
        success: [a.deleteSequence],
        error: [a.getCaretPosition, a.prepDeleteOneBack, a.deleteSequence]
    });
    // controller.signal('moveCaretLeftOne', 
    //     a.isShiftHeld, {
    //         success: [a.getSelectionLayer, a.moveSelectionLayer(-1)],
    //         error: [a.clearSelectionLayer, a.moveCaret(-1)]
    //     } 
    // );
    // controller.signal('moveCaretDownARow', 
    //     a.isShiftHeld, {
    //         success: [a.getSelectionLayer, a.moveSelectionLayer(-1)],
    //         error: [a.clearSelectionLayer, a.moveCaret(-1)]
    //     } 
    // );
    //caret functions
    for (var signalName in a.moveCaretShortcutFunctions) {
        var action = a.moveCaretShortcutFunctions[signalName]
        controller.signal(signalName, action)
    }

    //tnr: NOT YET WORKING:
    //higher priority
    controller.signal('pasteSequenceString', a.pasteSequenceString);
    controller.signal('setOrClearSelectionLayer', a.setOrClearSelectionLayer);
    controller.signal('toggleAnnotationDisplay', a.setCaretPosition, a.toggleAnnotationDisplay); // in progress - SL

    //lower priority
    controller.signal('addAnnotations', a.addAnnotations);
    controller.signal('jumpToRow', a.jumpToRow);


}