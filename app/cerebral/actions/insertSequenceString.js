// used for sequence strings coming in from outisde, needs to be made into a sequence

var insertSequenceData = require('./insertSequenceData');
export default function insertSequenceString({input, tree, output}) {
    debugger
    var { sequenceString } = input;
    insertSequenceData({
        sequence: sequenceString
    });
}
