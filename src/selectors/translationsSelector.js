import { reduce } from "lodash";
import uuid from "shortid";
import sequenceSelector from "./sequenceSelector";
import orfsSelector from "./orfsSelector";
import { createSelector } from "reselect";

import { getAminoAcidDataForEachBaseOfDna } from "ve-sequence-utils";
import each from "lodash/each";
import translationsRawSelector from "./translationsRawSelector";
import translationSearchMatchesSelector from "./translationSearchMatchesSelector";
import { normalizePositionByRangeLength } from "ve-range-utils";
import cdsFeaturesSelector from "./cdsFeaturesSelector";
import circularSelector from "./circularSelector";

function translationsSelector(
  isCircular,
  translationSearchMatches,
  sequence,
  orfs,
  showOrfTranslations,
  showOrfs,
  cdsFeatures,
  showCdsFeatureTranslations,
  showFeatures,
  translations,
  frameTranslations
) {}

export default createSelector(
  circularSelector,
  translationSearchMatchesSelector,
  sequenceSelector,
  orfsSelector,
  (state) => state.annotationVisibility.orfTranslations,
  (state) => state.annotationVisibility.orfs,
  cdsFeaturesSelector,
  (state) => state.annotationVisibility.cdsFeatureTranslations,
  (state) => state.annotationVisibility.features,
  translationsRawSelector,
  (state) => state.frameTranslations,
  (state) => state.sequenceData.isProtein,
  (state) => state.sequenceData.proteinSequence,
  translationsSelector
);
