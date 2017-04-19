module.exports = function toggleShowRow({input: { showRow }, state, output}) {
    state.set('showRow', showRow);
}
