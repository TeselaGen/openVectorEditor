import { createSelector } from "reselect";
import { omitBy } from "lodash";
import featuresSelector from "./featuresSelector";
import featureTypesToHideSelector from "./featureTypesToHideSelector";

function filteredFeaturesSelector(features, featureTypesToHide) {
  return omitBy(features, feat => {
    if (featureTypesToHide[feat.type]) {
      return true;
    }
  });
}

export default createSelector(
  featuresSelector,
  featureTypesToHideSelector,
  filteredFeaturesSelector
);
