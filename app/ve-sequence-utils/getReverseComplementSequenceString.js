import DNAComplementMap from './DNAComplementMap';
import ac from 've-api-check'; 
// ac.throw([ac.string,ac.bool],arguments);
export default function getReverseComplementSequenceString (sequence) {
    ac.throw([ac.string],arguments);
    var reverseComplementSequenceString = "";
    for (var i = sequence.length - 1; i >= 0; i--) {
        var revChar = DNAComplementMap[sequence[i]];
        if (!revChar) {
            revChar = sequence[i];
            // throw new Error('trying to get the reverse compelement of an invalid base');
        }
        reverseComplementSequenceString+= revChar;
    }
    return reverseComplementSequenceString;
};