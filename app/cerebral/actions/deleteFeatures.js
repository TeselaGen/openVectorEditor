export default function deleteFeatures({ input: { featureIds }, state, output }) {
    var features = state.get(['sequenceData', 'features']);
    features = features.filter((feature) => { return featureIds.indexOf(feature.id) === -1; });
    state.set(['sequenceData', 'features'], features);
}
