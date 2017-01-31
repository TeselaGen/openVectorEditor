var assign = require('lodash/object/assign');

export default function updateHistory({input: { newHistory }, state, output}) {
    var maxHistoryToKeep = 24;

    //new unsaved changes made
    if (newHistory) {
        let hist = assign({}, newHistory);
        hist.saved = false;
        state.push('history', hist);

        if (state.get('history').length > maxHistoryToKeep) {
            state.shift('history');
        }
    }

    // changes are saved to server
    else {
        let temp = [];
        while ( state.get('history').length > 1 ) {
            let hist = state.shift('history');
            temp.push(hist);
        }

        let mostRecent = state.shift('history');
        let lastHist = assign({}, mostRecent);
        lastHist.saved = true;
        temp.push(lastHist);

        while ( temp.length > 0 ) {
            state.push('history', temp.shift());
        }
    }
}
