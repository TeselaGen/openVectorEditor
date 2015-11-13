export default function checkIfEditAllowed({ selectionLayer }, tree, output) {
    if (tree.get('readOnly')) {
        output.readOnly();
    } else {
        output.editAllowed();
    }
}
checkIfEditAllowed.outputs = ['editAllowed', 'readOnly'];