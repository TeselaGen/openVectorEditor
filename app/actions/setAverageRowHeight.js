var tree = require('../baobabTree');



module.exports = function setAverageRowHeight(averageRowHeight) {
    if (areNonNegativeIntegers([averageRowHeight])) {
        tree.select('vectorEditorState', 'averageRowHeight').set(averageRowHeight);
    }
};