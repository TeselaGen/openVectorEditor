export default function getSelectionLayer({}, tree, output) {
    var selectionLayer = tree.get(['selectionLayer']);
    if (selectionLayer.selected) {
        output.success({
            selectionLayer: tree.get(['selectionLayer'])
        });
    } else {
        output.error({
            selectionLayer: tree.get(['selectionLayer'])
        })
    }
}