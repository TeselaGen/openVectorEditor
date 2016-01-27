// this is throwing a weird eslint error

var ac = require('ve-api-check');
module.exports = function filterSequenceString(sequenceString) {
    ac.throw(ac.string,sequenceString);
    return sequenceString.replace(/[^atgcyrswkmbvdhn]/ig, '');
}
