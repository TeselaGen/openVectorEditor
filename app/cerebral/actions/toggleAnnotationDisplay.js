export default function toggleAnnotationDisplay({input, value, state, output}) {
    var { type } = input;
    var { value } = input;

    if (value) {
        var currently = false;
    } else {
        var currently = state.get('show' + type);
    }
    currently = !!currently; // force a bool, might not be necessary

    state.set('show' + type, !currently);
}
