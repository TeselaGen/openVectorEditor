function searchSequence({input: { searchString }, state, output}) {
    if (searchString.length === 0) {
        output({ searchLayers: [] });
        return;
    }

    var sequence = state.get(['sequenceData', 'sequence']);
    var match;
    var layers = [];
    var regex = new RegExp(searchString, 'gi');

    do {
        match = regex.exec(sequence);
        if (match) {
            layers.push({ start: match.index, end: match.index + searchString.length, selected: true });
        }
    } while (match);

    output({ searchLayers: layers });
}

module.exports = searchSequence;
