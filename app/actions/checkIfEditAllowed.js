export default function checkIfEditAllowed({ selectionLayer }, tree, output) {
    if (tree.get('readOnly')) {
        tree.set('readOnly', false);
        // console.log("set false");
    } else {
        tree.set('readOnly', true);
        // console.log("set true");
    }
}
checkIfEditAllowed.outputs = ['editAllowed', 'readOnly'];