var ac = require('ve-api-check/apiCheck');
export default function handleEditorDragStarted({
    nearestBP, caretGrabbed
}, tree, output) {
	ac.throw(ac.posInt, nearestBP);
	ac.throw(ac.bool, caretGrabbed);
    var selectionLayer = tree.get('selectionLayer');
    if (caretGrabbed && selectionLayer.selected) {
        if (selectionLayer.start === nearestBP) {
            tree.set(['editorDrag', 'fixedCaretPositionOnDragStart'], selectionLayer.end + 1)
            tree.set(['editorDrag', 'fixedCaretPositionOnDragStartType'], 'end')
                //plus one because the cursor position will be 1 more than the selectionLayer.end
                //imagine selection from
                //0 1 2  <--possible cursor positions
                // A T G
                //if A is selected, selection.start = 0, selection.end = 0
                //so the nearestBP for the end of the selection is 1!
                //which is selection.end+1
        } else {
            tree.set(['editorDrag', 'fixedCaretPositionOnDragStart'], selectionLayer.start)
            tree.set(['editorDrag', 'fixedCaretPositionOnDragStartType'], 'start')
        }
    } else {
        tree.set(['editorDrag', 'fixedCaretPositionOnDragStart'], nearestBP)
        tree.set(['editorDrag', 'fixedCaretPositionOnDragStartType'], 'caret')
    }
}