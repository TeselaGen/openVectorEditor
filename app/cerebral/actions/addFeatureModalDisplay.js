module.exports = function addFeatureModalDisplay({input, state, output}) {
    var currentDisplay = state.get('showAddFeatureModal');
    state.set('showAddFeatureModal', !currentDisplay);
}