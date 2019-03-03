import { tidyUpSequenceData } from "ve-sequence-utils";
// import cleanSequenceData from "./utils/cleanSequenceData";

export default function updateEditor(
  store,
  editorName,
  initialValues = {},
  extraMeta = {},
  convertAnnotationsFromAAIndices
) {
  const currentEditor = store.getState().VectorEditor[editorName] || {};
  const isAlreadyProteinEditor =
    currentEditor.sequenceData && currentEditor.sequenceData.isProtein;

  const {
    sequenceData,
    annotationVisibility,
    annotationsToSupport,
    panelsShown,
    ...rest
  } = initialValues;

  let toSpread = {};
  if (sequenceData) {
    if (sequenceData.isProtein && !isAlreadyProteinEditor) {
      //we're editing a protein but haven't initialized the protein editor yet
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
    } else if (isAlreadyProteinEditor && !sequenceData.isProtein) {
      //we're editing dna but haven't initialized the dna editor yet
      // toSpread = {
      //   findTool: {
      //     dnaOrAA: "AA"
      //   },
      //   annotationVisibility: {
      //     caret: true,
      //     sequence: false,
      //     reverseSequence: false,
      //     ...annotationVisibility,
      //     translations: false,
      //     aminoAcidNumbers: false,
      //     primaryProteinSequence: true
      //   },
      //   annotationsToSupport: {
      //     features: true,
      //     translations: false,
      //     primaryProteinSequence: true,
      //     parts: true,
      //     orfs: false,
      //     cutsites: false,
      //     primers: true,
      //     ...annotationsToSupport
      //   }
      // };
    }
  }
  const initialValuesToUse = {
    ...toSpread,
    ...rest,
    ...(sequenceData && {
      sequenceData: tidyUpSequenceData(sequenceData, {
        convertAnnotationsFromAAIndices,
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
