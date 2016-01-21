function toggleSequenceCase({state}) {
    state.set('uppercase', !state.get('uppercase'));
}

module.exports = toggleSequenceCase;
