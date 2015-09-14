var tree = require('../baobabTree');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');


module.exports = function setVisibleRows(newVisibleRows) {
    if (newVisibleRows && areNonNegativeIntegers([newVisibleRows.start, newVisibleRows.end])) {
        // var totalRows = tree.get(['$totalRows']);
        // if (newVisibleRows.end > totalRows - 1) {
        // 	newVisibleRows = {
        // 		start: newVisibleRows.start - (newVisibleRows.end - totalRows - 1),
        // 		end: totalRows - 1
        // 	}
        // }
        var previousVisibleRows = tree.select('visibleRows').get();
        if (previousVisibleRows.start !== newVisibleRows.start || previousVisibleRows.end !== newVisibleRows.end) {
            tree.set(['visibleRows'], newVisibleRows);
        }
    } else {
        throw new Error("visibleRows object is missing or invalid");
    }
};