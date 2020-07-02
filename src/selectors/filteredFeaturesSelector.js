import { createSelector } from "reselect";
import { omitBy } from "lodash";
import featuresSelector from "./featuresSelector";
import featureTypesToHideSelector from "./featureTypesToHideSelector";
import featureLengthsToHideSelector from "./featureLengthsToHideSelector";

function filteredFeaturesSelector(
  features,
  featureTypesToHide,
  featureLengthsToHide
) {
  return omitBy(features, (feat) => {
    const featLength = feat.end - feat.start;
    const hideFeaturesByType = featureTypesToHide[feat.type];
    const hideFeaturesByLength =
      featureLengthsToHide.enabled &&
      (featLength < featureLengthsToHide.min ||
        featLength > featureLengthsToHide.max);
    return hideFeaturesByLength || hideFeaturesByType;
  });
}

export default createSelector(
  featuresSelector,
  featureTypesToHideSelector,
  featureLengthsToHideSelector,
  filteredFeaturesSelector
);
