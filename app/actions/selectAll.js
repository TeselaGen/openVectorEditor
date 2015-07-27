var tree = require('../baobabTree');

module.exports = function selectAll() {
    //compare the sequenceString being pasted in with what's already stored in the clipboard
    var sequenceLength = tree.get(['$sequenceLength']);
    this.setSelectionLayer({
        start: 0,
        end: sequenceLength - 1
    });
};