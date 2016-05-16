export default function toggleAnnotationDisplay({input, state, output}) {
    var Type = { input };
    if (state.get('show' + Type)) {
        state.set('show' + Type, false);
    } else {
        state.set('show' + Type, true);
    }
}