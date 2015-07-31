var tree = require('../baobabTree');
var ObjectID = require("bson-objectid");
var assign = require('lodash/object/assign');
var filterSequenceString = require('../filterSequenceString');
var insertSequenceString = require('./insertSequenceString.js');
var insertSequenceData = require('./insertSequenceData');

module.exports = function pasteSequenceString(sequenceString) {
    //compare the sequenceString being pasted in with what's already stored in the clipboard
    var clipboardData = tree.select('vectorEditorState', 'clipboardData').get();
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
};