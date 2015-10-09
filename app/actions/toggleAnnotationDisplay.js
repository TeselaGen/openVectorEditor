var ac = require('ve-api-check');
var capitalize = require('capitalize')
export default function toggleAnnotationDisplay({annotationType}, tree, output) {
    ac.throw(ac.annotationType, annotationType);
    if (tree.get('show' + capitalize(annotationType))) {
        tree.get('show' + capitalize(annotationType), false);
    } else {
        tree.get('show' + capitalize(annotationType), true);
    }
}