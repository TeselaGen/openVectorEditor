import cleanSequenceData from "../lib/utils/cleanSequenceData";

export default function updateEditor(store, editorName, initialValues = {}) {
  const { sequenceData = {}, ...rest } = initialValues;
  const initialValuesToUse = {
    ...rest,
    sequenceDataHistory: {
      past: [],
      present: cleanSequenceData(sequenceData),
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
