module.exports = function sidebarToggle({input, state, output}) {
    var currentSidebar = state.get('showSidebar');
    // hide the rowview when the sidebar pops out
    var currentRow = state.get('showRow');

    state.set('showRow', !currentRow);
    state.set('showSidebar', !currentSidebar);
    state.set('sidebarType', 'Features'); // features are default but making sure
}
