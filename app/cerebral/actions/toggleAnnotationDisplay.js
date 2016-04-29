export default function toggleAnnotationDisplay({input, state, output}) {
    var { type } = input;
    var currently = state.get('show' + type);
    currently = !!currently; // force a bool, might not be necessary

    state.set('show' + type, !currently);
}