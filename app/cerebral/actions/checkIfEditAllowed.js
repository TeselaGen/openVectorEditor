export default function checkIfEditAllowed(input, tree, output) {
    var selectionLayer = tree.get('selectionLayer');

    if (tree.get('readOnly')) {
        output.readOnly();
    } else {
        output.editAllowed();
    }
}
checkIfEditAllowed.outputs = ['editAllowed', 'readOnly'];