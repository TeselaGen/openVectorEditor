var assign = require('lodash/object/assign');

export default function updateFeature({ input: { feature }, state, output }) {
    var temp = [];

    feature.start = parseInt(feature.start);
    feature.end = parseInt(feature.end);
    feature.forward = parseInt(feature.strand);

    if ( isNaN(feature.start + feature.end + feature.forward) )
        return;

    while ( state.get(['sequenceData', 'features', 'length']) > 0 ) {
        let f = state.shift(['sequenceData', 'features']);

        if ( f.id === feature.id ) {
            temp.push(assign({}, f, feature));
        } else {
            temp.push(f);
        }
    }

    while ( temp.length > 0 ) {
        state.push(['sequenceData', 'features'], temp.shift());
    }
}
