var tree = require('../baobabTree');
var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData.js');

module.exports = function (simpleSequenceData) {
    if (!simpleSequenceData) {
        //initialize it with something
        simpleSequenceData = {sequence: 'atgc'};
    }
    tree.set(['sequenceData'], tidyUpSequenceData(simpleSequenceData));
};

