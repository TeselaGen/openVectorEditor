import { reduce } from "lodash";
import uuid from "uuidv4";
import sequenceSelector from "./sequenceSelector";
import orfsSelector from "./orfsSelector";
import { createSelector } from "reselect";

import { getAminoAcidDataForEachBaseOfDna } from "ve-sequence-utils";
// import lruMemoize from 'lru-memoize';
// import bsonObjectid from 'bson-objectid';
import each from "lodash/each";
import translationsRawSelector from "./translationsRawSelector";
import translationSearchMatchesSelector from "./translationSearchMatchesSelector";

function translationsSelector(
  translationSearchMatches,
  sequence,
  orfs,
  showOrfTranslations,
  showOrfs,
  translations
) {
  let translationsToPass = {
    ...translationSearchMatches.reduce((acc, match) => {
      if (!match) return acc;
      const id = match.id || uuid();
      acc[id] = {
        ...match,
        id,
        isOrf: true, //pass isOrf = true here in order to not have it show up in the properties window
        forward: !match.bottomStrand
      };
      return acc;
    }, {}),
    ...reduce(
      translations,
      (acc, translation) => {
        if (!translation.isOrf) {
          acc[translation.id] = translation;
        }
        return acc;
      },
      {}
    ),
    ...(showOrfTranslations && showOrfs ? orfs : {})
  };
  console.log("translationsToPass:", translationsToPass);
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
  function(state) {
    return state.annotationVisibility.orfTranslations;
  },
  function(state) {
    return state.annotationVisibility.orfs;
  },
  translationsRawSelector,
  translationsSelector
);
