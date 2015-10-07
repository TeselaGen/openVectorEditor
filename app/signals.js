// controller.signal('sequenceDataInserted',
//     a.getSelectionLayer, {
//         success: [a.deleteDeleteSequence, a.setCaretPosition]
//     },
//     a.getCaretPosition,
//     a.insertSequenceData)

// var a = require('require-all')(__dirname + '/actions');
// var a = require.context(
//   "./actions", // context folder
//   true, // include subdirectories
//   /^((?!test).)*$/ //RegExp
// )
// ("./" + expr + "")
// 

// function requireAll(r) { r.keys().forEach(r); }
// debugger;
var reqContext = require.context('./actions/', false, /^((?!test).)*$/);
var a = {};
reqContext.keys().forEach(function(key) {
    a[key.substring(2)] = reqContext(key)
});
// var getSelectionLayerAsRange = modifyAction(a.getSelectionLayer, {
//     mapOut: function(output) {
//       return output.
//     }
// })
// var inputSelector = require('inputSelector');

// var editorSignals = {
//     // annotationsAdded: [a.addAnnotations],
//     // backspacePressed: [a.getCaretPosition, a.getSelection, a.deleteOneBack],
//     // copyTriggered: [a.getSelection, a.copySelection],
//     // deleteTriggered: [a.deleteSequence],
//     // selectionLayerChanged: [a.setOrClearSelectionLayer],
//     addAnnotations: [a.addAnnotations],
//     backspacePressed: [a.getCaretPosition, a.getSelectionLayer, a.deleteOneBack],
//     copySelection: [a.getSelectionLayer, a.copySelection],
//     deleteSequence: [a.deleteSequence],
//     sequenceDataInserted: [a.getSelectionLayer, {
//             success: [a.deleteSequence]
//         },
//         a.getCaretPosition,
//         a.insertSequenceData
//     ],
//     jumpToRow: [a.jumpToRow],
//     moveCaretShortcutFunctions: [a.moveCaretShortcutFunctions],
//     pasteSequenceString: [a.pasteSequenceString],
//     selectAll: [a.selectAll, a.setOrClearSelectionLayer],
//     setCaretPosition: [a.setCaretPosition],
//     setOrClearSelectionLayer: [a.setOrClearSelectionLayer],
//     setCutsiteLabelSelection: [a.setCutsiteLabelSelection],
//     toggleAnnotationDisplay: [a.setCaretPosition],
// }

// var modules = [editorSignals];

//add all the signals to the cerebral controller here
export default function registerSignals(controller) {
    controller.signal('addAnnotations', a.addAnnotations);
    controller.signal('backspacePressed', a.getSelectionLayer, {
        success: [a.deleteSequence],
        error: [a.getCaretPosition, a.prepDeleteOneBack, a.deleteSequence]
    });
    controller.signal('copySelection', a.getSelectionLayer, a.copySelection);
    controller.signal('deleteSequence', a.deleteSequence);
    controller.signal('sequenceDataInserted', 
        a.getSelectionLayer, {
            success: [a.deleteSequence]
        }, a.getCaretPosition, a.insertSequenceData); 
    controller.signal('jumpToRow', a.jumpToRow);
    controller.signal('moveCaret', a.moveCaretShortcutFunctions);
    controller.signal('pasteSequenceString', a.pasteSequenceString);
    controller.signal('selectAll', a.selectAll, a.setOrClearSelectionLayer);
    controller.signal('setCaretPosition', a.setCaretPosition);
    controller.signal('setOrClearSelectionLayer', a.setOrClearSelectionLayer);
    controller.signal('editorClicked', a.setCaretPosition, a.setOrClearSelectionLayer);
    controller.signal('setCutsiteLabelSelection', a.setCutsiteLabelSelection);
    controller.signal('toggleAnnotationDisplay', a.setCaretPosition);
    // for (var signals of modules) {
    //     for (var signalName in signals) {
    //         var actions = signals[signalName]
    //         controller.signal(signalName, ...actions)
    //     }
    // }
}