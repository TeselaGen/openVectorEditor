import { createSelector } from "reselect";
import { omitBy } from "lodash";
import featuresSelector from "./featuresSelector";
import featureTypesToHideSelector from "./featureTypesToHideSelector";
import featureLengthsToHide from "./featureLengthsToHide";

function filteredFeaturesSelector(features, featureTypesToHide) {
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
  filteredFeaturesSelector
);
