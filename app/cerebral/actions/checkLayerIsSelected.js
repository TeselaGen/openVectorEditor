export default function checkLayerIsSelected({ selectionLayer }, tree, output) {
    if (selectionLayer.selected) {
        output.selected();
    } else {
        output.notSelected()
    }
}
checkLayerIsSelected.outputs = ['selected', 'notSelected'];