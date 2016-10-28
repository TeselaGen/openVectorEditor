module.exports = function showChangeMinOrfSizeDialog({input, state, output}) {
    var currentDisplay = state.get('showOrfModal');
    state.set('showOrfModal', !currentDisplay);
}