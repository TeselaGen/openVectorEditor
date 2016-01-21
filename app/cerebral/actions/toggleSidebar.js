// if same sidebar toggle is hit twice the sidebar opens and closes
// toggling a different sidebar closes the current and opens that sidebar
module.exports = function toggleSidebar({input, state, output}) {
    var currentSidebar = state.get('showSidebar')
    if (!currentSidebar) {
        state.set('showSidebar', input.currentSidebar)
    } else {
        if (currentSidebar === input.currentSidebar) {
            state.set('showSidebar', '') //an empty string evaluates false so sidebar isn't shown
        } else {
            state.set('showSidebar', input['currentSidebar'])
        }
    }
}