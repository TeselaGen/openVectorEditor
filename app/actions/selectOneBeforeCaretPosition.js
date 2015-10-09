var isNonNegativeInteger = require('validate.io-nonnegative-integer');
var setSelectionLayer = require('./setSelectionLayer');
export default function setSelectionLayer(caretPosition, tree, output) {
    if (isNonNegativeInteger(caretPosition)) {
        setSelectionLayer()
    }
}