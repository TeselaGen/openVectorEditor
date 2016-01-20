export default function checkIfEditAllowed({input, state, output}) {
    var selectionLayer = state.get('selectionLayer');

    if (state.get('readOnly')) {
        output.readOnly();
    } else {
        output.editAllowed();
    }
}
checkIfEditAllowed.outputs = ['editAllowed', 'readOnly'];