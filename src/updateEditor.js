import { tidyUpSequenceData } from "ve-sequence-utils";
// import cleanSequenceData from "./utils/cleanSequenceData";

export default function updateEditor(
  store,
  editorName,
  initialValues = {},
  extraMeta = {}
) {
  const {
    sequenceData,
    annotationVisibility,
    annotationsToSupport,
    panelsShown,
    ...rest
  } = initialValues;

  let toSpread = {};
  if (sequenceData && sequenceData.isProtein) {
    toSpread = {
      findTool: {
        dnaOrAA: "AA"
      },
      annotationVisibility: {
        caret: true,
        sequence: false,
        reverseSequence: false,
        ...annotationVisibility,
        translations: false,
        aminoAcidNumbers: false,
        primaryProteinSequence: true
      },
      annotationsToSupport: {
        features: true,
        translations: false,
        primaryProteinSequence: true,
        parts: true,
        orfs: false,
        cutsites: false,
        primers: true,
        ...annotationsToSupport
      }
    };
  }
  const initialValuesToUse = {
    ...toSpread,
    ...rest,
    ...(sequenceData && {
      sequenceData: tidyUpSequenceData(sequenceData, {
        //if we have sequence data coming in make sure to tidy it up for the user :)
        annotationsAsObjects: true
      })
    })
  };

  store.dispatch({
    type: "VECTOR_EDITOR_UPDATE",
    payload: initialValuesToUse,
    meta: {
      editorName,
      disregardUndo: true,
      ...extraMeta
    }
  });
}
