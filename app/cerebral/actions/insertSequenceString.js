var insertSequenceData = require('./insertSequenceData');
export default function insertSequenceString({input: {sequenceString}, state, output}) {
    insertSequenceData({
        sequence: sequenceString
    });
}