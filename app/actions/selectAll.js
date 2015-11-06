export default function selectAll(input, tree, output) {
    //compare the sequenceString being pasted in with what's already stored in the clipboard
    var sequenceLength = tree.get(['sequenceLength']);
    var all = {
        start: 0,
        end: sequenceLength - 1
    }
    tree.set('selectionLayer', all);
    output({
        start: 0,
        end: sequenceLength - 1
    });
}