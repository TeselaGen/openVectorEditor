import tree from '../baobabTree';
import tidyUpSequenceData from 've-sequence-utils/tidyUpSequenceData.js';

export default function (simpleSequenceData) {
    if (!simpleSequenceData) {
        //initialize it with something
        simpleSequenceData = {sequence: 'atgc'};
    }
    tree.set(['sequenceData'], tidyUpSequenceData(simpleSequenceData));
};

