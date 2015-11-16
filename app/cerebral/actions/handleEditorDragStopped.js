var ac = require('ve-api-check/apiCheck');
export default function handleEditorDragStopped(input, tree) {
    tree.set(['editorDrag', 'inProgress'], false)
}