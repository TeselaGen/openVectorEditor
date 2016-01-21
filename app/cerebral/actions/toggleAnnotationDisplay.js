var ac = require('ve-api-check');
var capitalize = require('capitalize');
export default function toggleAnnotationDisplay({input: {type}, state, output}) {
    ac.throw(ac.type, type);
    var capitalizedType = capitalize({type});
    // console.log(capitalizedType);

    if (state.get('show' + capitalizedType)) {
        state.set('show' + capitalizedType, false);
        // console.log("set false");
    } else {
        state.set('show' + capitalizedType, true);
        // console.log("set true");
    }
}