function resizeRowView({input: { rootWidth, rootHeight }, state, output}) {
    state.set('rowViewDimensions', {
        width: rootWidth,
        height: rootHeight
    });
}

module.exports = resizeRowView;
