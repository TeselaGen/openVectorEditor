import cleanSequenceData from '../lib/utils/cleanSequenceData'

export default function updateEditor(
  store,
  editorName,
  initialValues={}
) {
  const {
    sequenceData = {}
  } = initialValues
  const initialValuesToUse = {
    ...initialValues,
    sequenceData: cleanSequenceData(sequenceData)
  }

  store.dispatch({
    type: "VECTOR_EDITOR_INITIALIZE",
    payload: initialValuesToUse,
    meta: {
      editorName
    }
  })
}