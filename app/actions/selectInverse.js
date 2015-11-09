export default function selectInverse(input, tree, output) {
    //compare the sequenceString being pasted in with what's already stored in the clipboard
    var sequenceLength = tree.get(['sequenceLength']);
    var selectionLayer = tree.get(['selectionLayer']);

    output({
        selectionLayer: {
            start: selectionLayer.end,
            end: selectionLayer.start - 1
        }
    });
}