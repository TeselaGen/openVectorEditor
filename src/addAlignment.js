export default function addAlignment(store, alignment = {}) {
  store.dispatch({
    type: "UPSERT_ALIGNMENT_RUN",
    payload: alignment
  });
}
