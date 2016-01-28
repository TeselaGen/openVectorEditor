// this is throwing a weird eslint error

var ac = require('ve-api-check');
module.exports = function filterSequenceString(sequenceString) {
    ac.throw(ac.string,sequenceString);
    if(sequenceString) {
        return sequenceString.replace(/[^atgcyrswkmbvdhn]/ig, '');
    } else {
        return sequenceString
    }
}
