function resizeCircularView({input: { rootWidth, rootHeight }, state, output}) {
    state.set('circularViewDimensions', {
        width: rootWidth,
        height: rootHeight
    });
}

module.exports = resizeCircularView;
