function searchSequence({input: { searchString }, state, output}) {
    if (searchString.length === 0) {
        output({ searchLayers: [] });
        return;
    }
    var sequence = state.get(['sequenceData', 'sequence']);

    var layers = [];
    var inResult = false;
    var lastIndex = 0;

    for (let i = 0; i < sequence.length; i++) {
        if (!inResult) {
            lastIndex = i;
        }

        if (sequence[i] === searchString[i - lastIndex]) {
            inResult = true;

            if (i - lastIndex === searchString.length - 1) {
                layers.push({ start: lastIndex, end: i, selected: true });
                inResult = false;
            }
        } else {
            inResult = false;
        }
    }

    output({ searchLayers: layers });
}

module.exports = searchSequence;
