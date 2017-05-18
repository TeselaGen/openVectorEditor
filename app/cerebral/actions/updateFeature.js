var assign = require('lodash/object/assign');

export default function updateFeature({ input: { feature, reset }, state, output }) {
    var temp = [];
    var sequenceData = state.get('sequenceData');
    var featureCopy = Object.assign({}, feature);

    if (parseInt(feature.end) === 0 && feature.locations && sequenceData.circular) {
        featureCopy.start = parseInt(feature.locations[0].genbankStart);
        featureCopy.end = parseInt(feature.locations[0].end);
    } else {
        featureCopy.start = parseInt(feature.start);
        featureCopy.end = parseInt(feature.end);
    }

    if ( isNaN(featureCopy.start + featureCopy.end + featureCopy.forward) )
        return;

    while ( state.get(['sequenceData', 'features', 'length']) > 0 ) {
        let f = state.shift(['sequenceData', 'features']);

        if ( f.id === featureCopy.id ) {
            temp.push(assign({}, f, featureCopy));
        } else {
            temp.push(f);
        }
    }

    while ( temp.length > 0 ) {
        state.push(['sequenceData', 'features'], temp.shift());
    }

    if (reset) {
        state.set('historyIdx', -2);
        state.set('savedIdx', 0);
    }
}
