import { createSelector } from "reselect";
import { omitBy } from "lodash";
import featuresSelector from "./featuresSelector";
import sequenceLengthSelector from "./sequenceLengthSelector";
import { hideAnnByLengthFilter } from "../utils/editorUtils";

function filteredFeaturesSelector(
  features,
  seqLen,
  featureIndividualToHide,
  featureTypesToHide,
  lengthsToHide
) {
  return omitBy(features, (ann) => {
    const hideIndividually = featureIndividualToHide[ann.id];
    const hideFeaturesByType = featureTypesToHide[ann.type];
    return (
      hideAnnByLengthFilter(lengthsToHide, ann, seqLen) ||
      hideFeaturesByType ||
      hideIndividually
    );
  });
}

export default createSelector(
  featuresSelector,
  sequenceLengthSelector,
  (state) => state.annotationVisibility.featureIndividualToHide,
  (state) => state.annotationVisibility.featureTypesToHide,
  (state) => state.featureLengthsToHide,
  filteredFeaturesSelector
);
