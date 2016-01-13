function toggleSequenceCase({}, tree, output) {
    tree.set('uppercase', !tree.get('uppercase'));
}

module.exports = toggleSequenceCase;
