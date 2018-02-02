import { tidyUpSequenceData } from "ve-sequence-utils";
// import cleanSequenceData from "./utils/cleanSequenceData";

export default function updateEditor(store, editorName, initialValues = {}) {
  const { sequenceData = {}, ...rest } = initialValues;
  const initialValuesToUse = {
    ...rest,
    sequenceDataHistory: {
      past: [],
      present: tidyUpSequenceData(sequenceData, { annotationsAsObjects: true }),
      future: []
    }
  };

  store.dispatch({
    type: "VECTOR_EDITOR_INITIALIZE",
    payload: initialValuesToUse,
    meta: {
      editorName
    }
  });
}
