var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

export default function prepDeleteOneBack({caretPosition}, tree, output) {
    if (areNonNegativeIntegers([caretPosition])) {
        output({selectionLayer: {
                        start: caretPosition - 1,
                        end: caretPosition - 1
                    }});
    } else {
        throw new Error('no caret or selection layer to delete!');
    }
}
