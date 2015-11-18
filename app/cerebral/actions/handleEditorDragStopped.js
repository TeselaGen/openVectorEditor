var ac = require('ve-api-check/apiCheck');
export default function handleEditorDragStopped(input, tree) {
    // setTimeout(function() {
    console.log('something cray: ');
        tree.set(['editorDrag', 'inProgress'], false)
    // }, 0);
}