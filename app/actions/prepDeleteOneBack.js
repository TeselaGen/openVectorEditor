export default function prepSelectionLayer (numberToMove, cursorAtEnd) {
	return function prepSelectionLayer({caretPosition, selectionLayer}, tree, output) {
        if (caretPosition > 0) {
            output({
                selectionLayer: {
                    start: caretPosition - 1,
                    end: caretPosition - 1,
                    cursorAtEnd: cursorAtEnd,
                }
            });
        } else {
            throw new Error('no caret or selection layer to delete!');
        }
	}
}

