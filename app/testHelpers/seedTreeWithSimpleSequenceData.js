import tree from '../baobabTree';
import tidyUpSequenceData from 've-sequence-utils/tidyUpSequenceData.js';

module.exports = function (simpleSequenceData) {
    if (!simpleSequenceData) {
        //initialize it with something
        simpleSequenceData = {sequence: 'atgc'};
    }
    tree.set(['sequenceData'], tidyUpSequenceData(simpleSequenceData));
};

