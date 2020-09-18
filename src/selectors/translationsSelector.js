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

function translationsSelector(
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
) {
  let translationsToPass = {
    ...translationSearchMatches.reduce((acc, match) => {
      if (!match) return acc;
      const id = match.id || uuid();
      acc[id] = {
        ...match,
        id,
        translationType: "AA Search Match",
        isOrf: true, //pass isOrf = true here in order to not have it show up in the properties window
        forward: !match.bottomStrand
      };
      return acc;
    }, {}),
    ...reduce(
      translations,
      (acc, translation) => {
        if (!translation.isOrf) {
          acc[translation.id] = {
            ...translation,
            translationType: "User Created"
          };
        }
        return acc;
      },
      {}
    ),
    ...(showOrfTranslations && showOrfs
      ? reduce(
          orfs,
          (acc, orf) => {
            acc[orf.id] = { ...orf, translationType: "ORF" };
            return acc;
          },
          {}
        )
      : {}),
    ...(showCdsFeatureTranslations &&
      showFeatures &&
      reduce(
        cdsFeatures,
        (acc, cdsFeature) => {
          acc[cdsFeature.id] = {
            ...cdsFeature,
            translationType: "CDS Feature"
          };
          return acc;
        },
        {}
      )),
    ...reduce(
      frameTranslations,
      (acc, isActive, frameName) => {
        const frameOffset = Number(frameName);
        if (isActive) {
          const id = uuid();
          acc[id] = {
            id,
            start: 0 + Math.abs(frameOffset) - 1,
            end: normalizePositionByRangeLength(
              sequence.length - 1 + Math.abs(frameOffset) - 1,
              sequence.length
            ),
            translationType: "Frame",
            forward: frameOffset > 0,
            isOrf: true //pass isOrf = true here in order to not have it show up in the properties window
          };
        }
        return acc;
      },
      {}
    )
  };
  each(translationsToPass, function(translation) {
    translation.aminoAcids = getAminoAcidDataForEachBaseOfDna(
      sequence,
      translation.forward,
      translation
    );
  });
  return translationsToPass;
}

export default createSelector(
  translationSearchMatchesSelector,
  sequenceSelector,
  orfsSelector,
  state => state.annotationVisibility.orfTranslations,
  state => state.annotationVisibility.orfs,
  cdsFeaturesSelector,
  state => state.annotationVisibility.cdsFeatureTranslations,
  state => state.annotationVisibility.features,
  translationsRawSelector,
  state => state.frameTranslations,
  state => state.sequenceData.isProtein,
  state => state.sequenceData.proteinSequence,
  translationsSelector
);
