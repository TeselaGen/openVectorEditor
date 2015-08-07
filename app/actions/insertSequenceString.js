var insertSequenceData = require('./insertSequenceData');

module.exports = function insertSequenceString(sequenceString) {
    insertSequenceData({
        sequence: sequenceString
    });
};