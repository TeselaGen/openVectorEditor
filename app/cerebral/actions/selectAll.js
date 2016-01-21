export default function selectAll({input, state, output}) {
    //compare the sequenceString being pasted in with what's already stored in the clipboard
    var sequenceLength = state.get(['sequenceLength']);
    output({
        selectionLayer: {
        	start: 0,
        	end: sequenceLength - 1
        }
    });
}