var ac = require('ve-api-check');
var capitalize = require('capitalize')
// ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
var tree = require('../baobabTree');

module.exports = function toggleAnnotationDisplay(annotationType) {
    ac.throw(ac.annotationType, annotationType);
    var showCursor = tree.select('show' + capitalize(annotationType));
    if (showCursor.get()) {
        showCursor.set(false);
    } else {
        showCursor.set(true);
    }
};