module.exports = function toggleAnnotationTable({input, state, output}) {
    var currentTableType = state.get('annotationTableType');

    if (!currentTableType) {
        state.set('annotationTableType', input.annotationType);
    } else {
        if (currentTableType === input.annotationType) {
            state.set('annotationTableType', ''); //an empty string evaluates false so sidebar isn't shown
        } else {
            state.set('annotationTableType', input.annotationType);
        }
    }
}
