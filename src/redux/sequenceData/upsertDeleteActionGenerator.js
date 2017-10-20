import omit from "lodash/omit";
import uuid from "uuid";

// ------------------------------------
// Reducer
// ------------------------------------
export default function upsertDeleteActionGenerator(
  upsertAction,
  deleteAction
) {
  return {
    [upsertAction]: (state, payload) => {
      const idToUse = payload.id || uuid();
      return {
        ...state,
        [idToUse]: { ...(state[idToUse] || {}), ...payload, id: idToUse }
      };
    },
    [deleteAction]: (state, payload) => {
      const id = payload.id || payload;
      return omit(state, id);
    }
  };
}
