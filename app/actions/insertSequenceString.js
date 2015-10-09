var insertSequenceData = require('./insertSequenceData');
export default function insertSequenceString({sequenceString}, tree, output) {
    insertSequenceData({
        sequence: sequenceString
    });
}