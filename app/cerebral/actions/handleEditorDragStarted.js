var ac = require('ve-api-check/apiCheck');
export default function handleEditorDragStarted({input: {
    nearestBP, caretGrabbed
}, state, output}) {
	ac.throw(ac.posInt, nearestBP);
	ac.throw(ac.bool, caretGrabbed);
    var selectionLayer = state.get('selectionLayer');
    if (caretGrabbed && selectionLayer.selected) {
        if (selectionLayer.start === nearestBP) {
            state.set(['editorDrag', 'fixedCaretPositionOnDragStart'], selectionLayer.end + 1)
            state.set(['editorDrag', 'fixedCaretPositionOnDragStartType'], 'end')
                //plus one because the cursor position will be 1 more than the selectionLayer.end
                //imagine selection from
                //0 1 2  <--possible cursor positions
                // A T G
                //if A is selected, selection.start = 0, selection.end = 0
                //so the nearestBP for the end of the selection is 1!
                //which is selection.end+1
        } else {
            state.set(['editorDrag', 'fixedCaretPositionOnDragStart'], selectionLayer.start)
            state.set(['editorDrag', 'fixedCaretPositionOnDragStartType'], 'start')
        }
    } else {
        state.set(['editorDrag', 'fixedCaretPositionOnDragStart'], nearestBP)
        state.set(['editorDrag', 'fixedCaretPositionOnDragStartType'], 'caret')
    }
}