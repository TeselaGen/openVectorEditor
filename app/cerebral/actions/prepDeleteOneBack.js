var normalizePositionByRangeLength = require('ve-range-utils/normalizePositionByRangeLength');
var setSelectionLayer = require('./setSelectionLayer');

export default function prepSelectionLayer(input, tree, output) {
    var {caretPosition, sequenceLength} = tree.get();
    var normedCaretPosition = normalizePositionByRangeLength(caretPosition -1, sequenceLength, true);

    setSelectionLayer({selectionLayer: {'start': normedCaretPosition, 'end': normedCaretPosition}}, tree);
}