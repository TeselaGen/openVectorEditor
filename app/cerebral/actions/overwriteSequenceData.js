var assign = require('lodash/object/assign');
var insertSequenceDataAtPosition = require('ve-sequence-utils/insertSequenceDataAtPosition');
var setSelectionLayer = require('./setSelectionLayer');

function overwriteSequenceData({input, state, output}) {
    var { newSequenceData } = input;
    var newSeq = newSequenceData.sequence;
    var newName = newSequenceData.name;
    var newFeatures = newSequenceData.features;
    // do schemaConvert's job again
    var feature;
    for(var f = 0; f < newFeatures.length; f++) {
        feature = newFeatures[f];
        feature.start = feature.locations[0].genbankStart;
        feature.end = feature.locations[0].end;
        feature.id = "feature_" + f;
    }
    
    // keep in mind there may be no features and no name / labels
    // clear previous state and delete sequence and features
    state.set('caretPosition', 0);
    state.set('history', []) // need to put this action in so we know to save
    state.set(['sequenceData', 'name'], newName);
    state.set(['sequenceData', 'sequence'], newSeq);
    state.set(['sequenceData', 'features'], newFeatures);
    // state.set('sequenceData', {newSequenceData}); // do we need schemaconvert here?
}

export default overwriteSequenceData;