import { filter } from "lodash";
import sequenceSelector from "./sequenceSelector";
import orfsSelector from "./orfsSelector";
import { createSelector } from "reselect";

import getAminoAcidDataForEachBaseOfDna from "ve-sequence-utils/getAminoAcidDataForEachBaseOfDna";
// import lruMemoize from 'lru-memoize';
// import bsonObjectid from 'bson-objectid';
import each from "lodash/each";
import translationsRawSelector from "./translationsRawSelector";

function translationsSelector(
  sequence,
  orfs,
  showOrfTranslations,
  showOrfs,
  translations
) {
  let translationsToPass = {
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
