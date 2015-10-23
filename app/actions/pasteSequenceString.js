var ObjectID = require("bson-objectid");
import assign from 'lodash/object/assign';
import filterSequenceString from 've-sequence-utils/filterSequenceString';
import insertSequenceString from './insertSequenceString.js';
import insertSequenceData from './insertSequenceData';

export default function pasteSequenceString({sequenceString}, tree, output) {
    //compare the sequenceString being pasted in with what's already stored in the clipboard
    var clipboardData = tree.get('clipboardData');
    if (clipboardData && clipboardData.sequence && clipboardData.sequence === sequenceString) {
        // insert clipboardData
        //assign clipboardData annotations new ids
        var clipboardDataWithNewIds = generateNewIdsForSequenceAnnotations(clipboardData);
        insertSequenceData(clipboardDataWithNewIds);
    } else {
        //clean up the sequence string and insert it
        insertSequenceString(filterSequenceString(sequenceString));
    }

    function generateNewIdsForSequenceAnnotations(sequenceData) {
        return assign({}, sequenceData, {
            features: generateNewIdsForAnnotations(sequenceData.features),
            parts: generateNewIdsForAnnotations(sequenceData.parts)
        });
    }

    function generateNewIdsForAnnotations(annotations) {
        return annotations.map(function(annotation) {
            return assign({}, annotation, {
                id: ObjectID().str
            });
        });
    }
}