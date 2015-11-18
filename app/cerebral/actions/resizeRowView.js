function resizeRowView({ rootWidth, rootHeight }, tree, output) {
    tree.set('rowViewDimensions', {
        width: rootWidth,
        height: rootHeight
    });
}

module.exports = resizeRowView;
