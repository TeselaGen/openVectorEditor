function resizeCircularView({ rootWidth, rootHeight }, tree, output) {
    tree.set('circularViewDimensions', {
        width: rootWidth,
        height: rootHeight
    });
}

module.exports = resizeCircularView;
