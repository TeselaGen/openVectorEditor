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
reqContext.keys().forEach(function(key){
    a[key.substring(2)] = reqContext(key)
});

var editorSignals = {
  // annotationsAdded: [a.addAnnotations],
  // backspacePressed: [a.getCaretPosition, a.getSelection, a.deleteOneBack],
  // copyTriggered: [a.getSelection, a.copySelection],
  // deleteTriggered: [a.deleteSequence],
  // selectionLayerChanged: [a.setSelectionLayer],
  addAnnotations: [a.addAnnotations],
  backspacePressed: [a.getCaretPosition, a.getSelectionLayer, a.deleteOneBack],
  copySelection: [a.getSelectionLayer, a.copySelection],
  deleteSequence: [a.deleteSequence],
  setSelectionLayer: [a.setSelectionLayer],
  insertSequenceString: [a.setCaretPosition],
  selectAll: [a.setCaretPosition],
  moveCaretShortcutFunctions: [a.setCaretPosition],
  pasteSequenceString: [a.setCaretPosition],
  setCaretPosition: [a.setCaretPosition],
  jumpToRow: [a.setCaretPosition],
  toggleAnnotationDisplay: [a.setCaretPosition],
}

var modules = [editorSignals];

export default function registerSignals (controller) {
  for (var signals of modules) {
    for (var signalName in signals) {
      var actions = signals[signalName]
      controller.signal(signalName, ...actions)
    }
  }
}
