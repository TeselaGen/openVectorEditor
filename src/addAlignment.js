export default function addAlignment(store, editorName, alignment = {}) {
  store.dispatch({
    type: "UPSERT_ALIGNMENT_RUN",
    payload: alignment,
    meta: {
      editorName
    }
  });
}
