export default function changeOrfMin({input, state, output}) {
    // change the minimum length to detect and display ORFs
    var { newMin } = input;
    newMin = parseInt(newMin);
    var seqLength = state.get('sequenceLength');
    if(newMin && newMin >= 0 && newMin < seqLength) {
        state.set('minimumOrfSize', newMin)
    } else {
        output.error('invalid value for minimum ORF length: ' + newMin);
    }
}