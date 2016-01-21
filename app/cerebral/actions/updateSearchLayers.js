function updateSearchLayers({input: { searchLayers }, state}) {
    state.set('searchLayers', searchLayers);
}

module.exports = updateSearchLayers;
