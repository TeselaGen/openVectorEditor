var ac = require('ve-api-check');
var capitalize = require('capitalize');
export default function toggleAnnotationDisplay(annotationType, tree, output) {
    ac.throw(ac.annotationType, annotationType);
    var capitalizedType = capitalize(annotationType);
    // console.log(capitalizedType);

    if (tree.get('show' + capitalizedType)) {
        tree.set('show' + capitalizedType, false);
        // console.log("set false");
    } else {
        tree.set('show' + capitalizedType, true);
        // console.log("set true");
    }
}