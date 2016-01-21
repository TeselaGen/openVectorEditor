export default function checkLayerIsSelected({input, state, output}) {
    var selectionLayer = state.get('selectionLayer');

    if (selectionLayer.selected) {
        output.selected();
    } else {
        output.notSelected()
    }
}
checkLayerIsSelected.outputs = ['selected', 'notSelected'];