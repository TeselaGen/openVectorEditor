import { tidyUpSequenceData } from "ve-sequence-utils";
// import cleanSequenceData from "./utils/cleanSequenceData";

export default function updateEditor(
  store,
  editorName,
  initialValues = {},
  extraMeta = {}
) {
  const { sequenceData = {}, ...rest } = initialValues;
  const initialValuesToUse = {
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
      ...extraMeta
    }
  });
}
