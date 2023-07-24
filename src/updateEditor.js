import { set } from "lodash";
import { tidyUpSequenceData } from "@teselagen/sequence-utils";
import { annotationTypes } from "@teselagen/sequence-utils";

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
  const isAlreadyOligoEditor =
    currentEditor.sequenceData && currentEditor.sequenceData.isOligo;
  const reverseSequenceShouldBeUpdate =
    currentEditor.sequenceData?.isSingleStrandedDNA !==
      sequenceData?.isSingleStrandedDNA ||
    currentEditor.sequenceData?.isDoubleStrandedRNA !==
      sequenceData?.isDoubleStrandedRNA;

  const isAlreadySpecialEditor =
    isAlreadyProteinEditor ||
    isAlreadyRnaEditor ||
    isAlreadyOligoEditor ||
    reverseSequenceShouldBeUpdate;

  let toSpread = {};
  let payload;
  if (justPassingPartialSeqData) {
    payload = {
      sequenceData: tidyUpSequenceData(
        { ...currentEditor.sequenceData, ...sequenceData },
        {
          convertAnnotationsFromAAIndices,
          //if we have sequence data coming in make sure to tidy it up for the user :)
          annotationsAsObjects: true
        }
      )
    };
  } else {
    if (sequenceData) {
      const isDna =
        !sequenceData.isOligo && !sequenceData.isRna && !sequenceData.isProtein;
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
            cutsites: false,
            translations: false,
            aminoAcidNumbers: false,
            primaryProteinSequence: true,
            ...annotationVisibility //we spread this here to allow the user to override this .. if they must!
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
      } else if (sequenceData.isOligo && !isAlreadyOligoEditor) {
        toSpread = {
          findTool: {
            dnaOrAA: "DNA",
            ...findTool //we spread this here to allow the user to override this .. if they must!
          },
          annotationVisibility: {
            caret: true,
            sequence: true,
            cutsites: false,
            reverseSequence: false,
            translations: false,
            aminoAcidNumbers: false,
            primaryProteinSequence: false,
            ...annotationVisibility //we spread this here to allow the user to override this .. if they must!
          },
          annotationsToSupport: {
            features: true,
            translations: true,
            primaryProteinSequence: false,
            parts: true,
            orfs: false,
            cutsites: true,
            primers: false,
            ...annotationsToSupport //we spread this here to allow the user to override this .. if they must!
          }
        };
      } else if (sequenceData.isRna && !isAlreadyRnaEditor) {
        toSpread = {
          findTool: {
            dnaOrAA: "DNA",
            ...findTool //we spread this here to allow the user to override this .. if they must!
          },
          annotationVisibility: {
            caret: true,
            sequence: true,
            cutsites: false,
            reverseSequence: sequenceData?.isDoubleStrandedRNA,
            translations: false,
            aminoAcidNumbers: false,
            primaryProteinSequence: false,
            ...annotationVisibility //we spread this here to allow the user to override this .. if they must!
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
      } else if (isAlreadySpecialEditor && isDna) {
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
            reverseSequence: !sequenceData?.isSingleStrandedDNA,
            translations: false,
            aminoAcidNumbers: false,
            primaryProteinSequence: false,
            ...annotationVisibility //we spread this here to allow the user to override this .. if they must!
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
  annotationTypes.forEach((t) => {
    if (Object.keys(sequenceData?.[t] || {}).length > 100) {
      set(payload, `annotationLabelVisibility.${t}`, false);
    }
  });
  if (sequenceData && sequenceData.size > 20000) {
    set(payload, "annotationVisibility.translations", false);
    set(payload, "annotationVisibility.cutsites", false);
  }

  store.dispatch({
    type: "VECTOR_EDITOR_UPDATE",
    payload,
    meta: {
      mergeStateDeep: true,
      editorName,
      disregardUndo: true,
      ...extraMeta
    }
  });
}
