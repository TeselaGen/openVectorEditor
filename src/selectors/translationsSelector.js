import { filter } from "lodash";
import uuid from "uuid";
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
        isOrf: true,
        forward: !match.bottomStrand
      };
      return acc;
    }, {}),
    ...filter(translations, translation => {
      return !translation.isOrf;
    }),
    ...(showOrfTranslations && showOrfs ? orfs : {})
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
  function(state) {
    return state.annotationVisibility.orfTranslations;
  },
  function(state) {
    return state.annotationVisibility.orfs;
  },
  translationsRawSelector,
  translationsSelector
);
