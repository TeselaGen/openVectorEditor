export default function checkLayerIsSelected({ selectionLayer }, tree, output) {
    if (selectionLayer.selected) {
        output.success();
    } else {
        output.error()
    }
}