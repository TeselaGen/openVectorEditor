module.exports = function highlightAllSearchResults({input: { value }, state, output}) {
    var current = state.get('highlightAllSearchResults');
    var newState = !current;
    if (value && value === "no") {
        newState = false;
    }
    state.set('highlightAllSearchResults', newState);
}
