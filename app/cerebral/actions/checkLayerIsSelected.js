export default function checkLayerIsSelected(input, tree, output) {
    var selectionLayer = tree.get('selectionLayer');
    // console.log(">>>>>> " + selectionLayer.selected);

    if (selectionLayer.selected) {
        output.selected();
    } else {
        output.notSelected()
    }
}
checkLayerIsSelected.outputs = ['selected', 'notSelected'];