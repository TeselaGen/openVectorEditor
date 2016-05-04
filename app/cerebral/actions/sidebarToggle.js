module.exports = function sidebarToggle({input, state, output}) {
    var current = state.get('showSidebar');
    state.set('showSidebar', !current);
    state.set('sidebarType', 'Features'); // features are default but making sure
}
