var tree = require('../baobabTree');
var _setSelectionLayer = require('./_setSelectionLayer');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

/**
 * sets the selection layer on a plasmid
 * @param  {object} newSelectionLayer {start: int, end: int, [cursorAtEnd: boolean]}
 * @return {undefined}                   
 */
module.exports = function setSelectionLayer (newSelectionLayer) {
    _setSelectionLayer()
    tree.select('selectionLayer').set(newSelectionLayer);
};