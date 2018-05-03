import { tidyUpSequenceData } from "ve-sequence-utils";
// import cleanSequenceData from "./utils/cleanSequenceData";

export default function updateEditor(
  store,
  editorName,
  initialValues = {},
  ...extraMeta
) {
  const { sequenceData = {}, ...rest } = initialValues;
  const initialValuesToUse = {
    ...rest,
    sequenceData: tidyUpSequenceData(sequenceData, {
      annotationsAsObjects: true
    })
  };

  store.dispatch({
    type: "VECTOR_EDITOR_INITIALIZE",
    payload: initialValuesToUse,
    meta: {
      editorName,
      ...extraMeta
    }
  });
}
