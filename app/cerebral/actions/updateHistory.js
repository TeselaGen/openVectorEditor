var assign = require('lodash/object/assign');

export default function updateHistory({input: { newHistory, idx }, state, output}) {
    var maxHistoryToKeep = 100;
    let history = state.get('history');
    let historyIdx = state.get('historyIdx') + 1;
    let undo = state.get('undo');

    //new unsaved changes made
    if (newHistory && !undo) {

        // fork history and toss old fork if we're not at the last element in the array
        if (historyIdx < history.length) {
            for (var i = history.length; i > historyIdx; i--) {
                state.pop('history');
            }
        }

        // only keep finite amt of history
        if (history.length >= maxHistoryToKeep) {
            state.shift('history');
            state.set('savedIdx', state.get('savedIdx') - 1);
            historyIdx -= 1;
        }

        state.push('history', newHistory);
        state.set('historyIdx', historyIdx);

    } else if (newHistory && undo) {
        state.set('undo', false);

    // undo & redo, idx will be either -1 or 1 respectively
    } else if (idx) {
        let newIdx = state.get('historyIdx') + idx;

        // the buttons are disabled, but the keyboard shortcuts can't be disabled and can cause errors
        if (newIdx < 0 || newIdx >= history.length) {
            return;
        }

        state.set('sequenceData', history[newIdx]);
        state.set('historyIdx', newIdx);
        state.set('undo', true);
    }
}
