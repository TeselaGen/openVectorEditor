var tree = require('../baobabTree');

module.exports = function moveCaret(rowToJumpTo) {
    tree.set(['vectorEditorState', 'rowToJumpTo'], rowToJumpTo);
};