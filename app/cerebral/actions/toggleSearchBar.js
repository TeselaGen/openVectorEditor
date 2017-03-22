module.exports = function toggleSearchBar({input, state, output}) {
    var current = state.get('showSearchBar');
    state.set('showSearchBar', !current);
    state.set('searchLayers', []);
    state.set('searchString', "");
}
