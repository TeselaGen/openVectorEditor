var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');


export default function prepSelectionLayer (numberToMove, caretAtEnd) {
	return function prepSelectionLayer({caretPosition, selectionLayer}, tree, output) {
        if (areNonNegativeIntegers([caretPosition])) {
            output({
                selectionLayer: {
                    start: caretPosition - 1,
                    end: caretPosition - 1,
                    caretAtEnd: caretAtEnd,
                }
            });
        } else {
            throw new Error('no caret or selection layer to delete!');
        }
	}
}

