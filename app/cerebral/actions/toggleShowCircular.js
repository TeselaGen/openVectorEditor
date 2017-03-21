module.exports = function toggleShowCircular({input: { showCircular }, state, output}) {
    state.set('showCircular', showCircular);
}
