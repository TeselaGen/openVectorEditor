module.exports = function sidebarToggle({input, state, output}) {
    var current = state.get('showSidebar');
    console.log("current state is " + current);
    console.log("its inverse is " + !current)
    state.set('showSidebar', !current);
    state.set('sidebarType', 'Features'); // features are default but making sure
}
