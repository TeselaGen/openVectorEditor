export default function selectAll(input, tree, output) {
    //compare the sequenceString being pasted in with what's already stored in the clipboard
    var sequenceLength = tree.get(['sequenceLength']);
    output({
        selectionLayer: {
        	start: 0,
        	end: sequenceLength - 1
        }
    });
}