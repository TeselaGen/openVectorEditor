import { createSelector } from "reselect";
import { filter } from "lodash";
import featuresSelector from "./featuresSelector";

function cdsFeaturesRawSelector(features) {
  return filter(features, ({ type }) => type && type.toUpperCase() === "CDS");
}

export default createSelector(featuresSelector, cdsFeaturesRawSelector);
