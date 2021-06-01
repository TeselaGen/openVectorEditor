import { tidyUpSequenceData } from "ve-sequence-utils";

export default function updateEditor(
  store,
  editorName,
  initialValues = {},
  extraMeta = {},
  { convertAnnotationsFromAAIndices } = {}
) {
  const {
    sequenceData,
    annotationVisibility,
    annotationsToSupport,
    findTool,
    justPassingPartialSeqData
  } = initialValues;
  const currentEditor = store.getState().VectorEditor[editorName] || {};
  const isAlreadyProteinEditor =
    currentEditor.sequenceData && currentEditor.sequenceData.isProtein;
  const isAlreadyRnaEditor =
    currentEditor.sequenceData && currentEditor.sequenceData.isRna;

  let toSpread = {};
  let payload;
  if (justPassingPartialSeqData) {
    payload = {
      sequenceData: { ...currentEditor.sequenceData, ...sequenceData }
    };
  } else {
    if (sequenceData) {
      if (sequenceData.isProtein && !isAlreadyProteinEditor) {
        //we're editing a protein but haven't initialized the protein editor yet
        toSpread = {
          findTool: {
            dnaOrAA: "AA",
            ...findTool //we spread this here to allow the user to override this .. if they must!
          },

          annotationVisibility: {
            caret: true,
            sequence: false,
            reverseSequence: false,
            ...annotationVisibility, //we spread this here to allow the user to override this .. if they must!
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
            primers: false,
            ...annotationsToSupport
          }
        };
      } else if (sequenceData.isRna && !isAlreadyRnaEditor) {
        //we're editing a protein but haven't initialized the protein editor yet
        toSpread = {
          findTool: {
            dnaOrAA: "DNA",
            ...findTool //we spread this here to allow the user to override this .. if they must!
          },
          annotationVisibility: {
            caret: true,
            sequence: false,
            reverseSequence: false,
            ...annotationVisibility, //we spread this here to allow the user to override this .. if they must!
            translations: false,
            aminoAcidNumbers: false,
            primaryProteinSequence: false
          },
          annotationsToSupport: {
            features: true,
            translations: true,
            primaryProteinSequence: false,
            parts: true,
            orfs: true,
            cutsites: true,
            primers: true,
            ...annotationsToSupport //we spread this here to allow the user to override this .. if they must!
          }
        };
      } else if (isAlreadyProteinEditor && !sequenceData.isProtein) {
        //we're editing dna but haven't initialized the dna editor yet
        sequenceData.isProtein = false;
        toSpread = {
          findTool: {
            dnaOrAA: "DNA",
            ...findTool //we spread this here to allow the user to override this .. if they must!
          },
          annotationVisibility: {
            caret: true,
            sequence: true,
            reverseSequence: true,
            ...annotationVisibility, //we spread this here to allow the user to override this .. if they must!
            translations: false,
            aminoAcidNumbers: false,
            primaryProteinSequence: false
          },
          annotationsToSupport: {
            features: true,
            translations: true,
            primaryProteinSequence: false,
            parts: true,
            orfs: true,
            cutsites: true,
            primers: true,
            ...annotationsToSupport //we spread this here to allow the user to override this .. if they must!
          }
        };
      }
    }
    payload = {
      ...initialValues,
      ...toSpread,
      ...(sequenceData && {
        sequenceData: tidyUpSequenceData(sequenceData, {
          convertAnnotationsFromAAIndices,
          //if we have sequence data coming in make sure to tidy it up for the user :)
          annotationsAsObjects: true
        })
      })
    };
  }

  store.dispatch({
    type: "VECTOR_EDITOR_UPDATE",
    payload,
    meta: {
      editorName,
      disregardUndo: true,
      ...extraMeta
    }
  });
}
