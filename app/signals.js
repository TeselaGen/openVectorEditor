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
    //tnr: MOSTLY WORKING: 
    controller.signal('backspacePressed', a.getSelectionLayer, {
        success: [a.deleteSequence],
        error: [a.getCaretPosition, a.prepDeleteOneBack, a.deleteSequence]
    });

    //tnr: NOT YET WORKING:
    controller.signal('jumpToRow', a.jumpToRow);
    controller.signal('deleteSequence', a.deleteSequence);
    controller.signal('moveCaret', a.moveCaretShortcutFunctions);
    controller.signal('pasteSequenceString', a.pasteSequenceString);
    controller.signal('setCaretPosition', a.setCaretPosition);
    controller.signal('setOrClearSelectionLayer', a.setOrClearSelectionLayer);
    controller.signal('editorClicked', a.setCaretPosition, a.setOrClearSelectionLayer);
    controller.signal('toggleAnnotationDisplay', a.setCaretPosition);
    controller.signal('addAnnotations', a.addAnnotations);
}