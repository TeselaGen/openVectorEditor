var ac = require('ve-api-check');
var capitalize = require('capitalize')
export default function toggleAnnotationDisplay({annotationType}, tree, output) {
    ac.throw(ac.annotationType, annotationType);
    var showCursor = tree.select('show' + capitalize(annotationType));
    if (showCursor.get()) {
        showCursor.set(false);
    } else {
        showCursor.set(true);
    }
};