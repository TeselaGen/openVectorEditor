module.exports = function gelDigestDisplay({input, state, output}) {
    var currentDisplay = state.get('showGelDigestDialog');
    state.set('showGelDigestDialog', !currentDisplay);
}