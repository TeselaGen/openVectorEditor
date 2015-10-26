import isNonNegativeInteger from 'validate.io-nonnegative-integer';
import _setSelectionLayer from './setSelectionLayer';
export default function setSelectionLayer(caretPosition, tree, output) {
    if (isNonNegativeInteger(caretPosition)) {
        _setSelectionLayer()
    }
}
