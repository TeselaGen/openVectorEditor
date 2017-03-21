function searchSequence({input: { searchString }, state, output}) {
    if (searchString.length === 0) {
        output({ searchLayers: [] });
        return;
    }

    // clear any selected layer
    state.set('selectionLayer', {
        start: -1,
        end: -1,
        id: -1,
        selected: false,
        cursorAtEnd: true
    });

    var sequence = state.get(['sequenceData', 'sequence']);
    var match;
    var layers = [];
    var regex = new RegExp(searchString, 'gi');

    do {
        match = regex.exec(sequence);
        if (match) {
            layers.push({
                start: match.index,
                end: match.index + searchString.length - 1,
                selected: true,
                cursorAtEnd: true
            });
        }
    } while (match);

    if (layers.length > 0) {
        state.set('selectionLayer', layers[0]);
    }

    output({ searchLayers: layers });
}

module.exports = searchSequence;
