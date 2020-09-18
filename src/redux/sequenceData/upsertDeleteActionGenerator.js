import omit from "lodash/omit";
import uuid from "shortid";

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
      let ids;
      if (Array.isArray(payload)) {
        ids = payload.map(val => {
          return val.id || val;
        });
      } else {
        ids = [payload.id || payload];
      }
      return omit(state, ids);
    }
  };
}
