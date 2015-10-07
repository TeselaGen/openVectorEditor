var isNonNegativeInteger = require('validate.io-nonnegative-integer');
var setOrClearSelectionLayer = require('./setOrClearSelectionLayer');
export default function setOrClearSelectionLayer(caretPosition, tree, output) {
    if (isNonNegativeInteger(caretPosition)) {
        setOrClearSelectionLayer()
    }
}