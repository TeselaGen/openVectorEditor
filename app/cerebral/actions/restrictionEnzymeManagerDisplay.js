module.exports = function restrictionEnzymeManagerDisplay({input, state, output}) {
    var currentDisplay = state.get('showRestrictionEnzymeManager');
    state.set('showRestrictionEnzymeManager', !currentDisplay);
}