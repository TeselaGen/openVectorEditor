var normalizePositionByRangeLength = require('ve-range-utils/normalizePositionByRangeLength');
var setSelectionLayer = require('./setSelectionLayer');

export default function prepSelectionLayer({input, state, output}) {
    var {caretPosition, sequenceLength} = state.get();
    var normedCaretPosition = normalizePositionByRangeLength(caretPosition -1, sequenceLength, true);

    setSelectionLayer({input: {selectionLayer: {'start': normedCaretPosition, 'end': normedCaretPosition}}, state});
}