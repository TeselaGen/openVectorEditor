// if same sidebar toggle is hit twice the sidebar opens and closes
// toggling a different sidebar closes the current and opens that sidebar
module.exports = function toggleSidebar(input, tree, output) {
    var currentSidebar = tree.get('showSidebar')
    if (!currentSidebar) {
        tree.set('showSidebar', input.currentSidebar)
    } else {
        if (currentSidebar === input.currentSidebar) {
            tree.set('showSidebar', '') //an empty string evaluates false so sidebar isn't shown
        } else {
            tree.set('showSidebar', input['currentSidebar'])
        }
    }
}