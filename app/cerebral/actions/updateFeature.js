var assign = require('lodash/object/assign');

export default function updateFeature({ input: { feature }, state, output }) {
    var temp = [];

    var featureCopy = Object.assign({}, feature);
    if (parseInt(feature.end) === 0 && feature.locations) {
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
}
