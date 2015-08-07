var tree = require('../baobabTree');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');


    module.exports = function setPreloadRowStart(preloadRowStart) {
        if (areNonNegativeIntegers([preloadRowStart])) {
            tree.select('vectorEditorState', 'preloadRowStart').set(preloadRowStart);
        }
    };