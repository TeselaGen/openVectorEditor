import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";
import uuid from "uniqid";
import { omit, difference } from "lodash";

// ------------------------------------
// Actions
// ------------------------------------
export const updateGuides = createAction("updateGuides");
export const deleteGuides = createAction("deleteGuides");
export const clearGuides = createAction("clearGuides");
// ------------------------------------
// Reducer
// ------------------------------------

export default createMergedDefaultStateReducer(
  {
    [updateGuides]: (state, payload) => {
      //guides should be 0-based inclusive! aka start: 0, end: 0 is a single basepair feature starting at the first bp

      // check for duplicates
      const duplicatedGuides = payload.filter(e =>
        Object.values(state.guides).some(
          g =>
            e.target === g.target &&
            e.start === g.start &&
            e.end === g.end &&
            Boolean(e.forward) === Boolean(g.forward)
        )
      );

      const nonDuplicatedGuides = difference(payload, duplicatedGuides);

      const newGuides = nonDuplicatedGuides.reduce((acc, guide) => {
        const idToUse = guide.id || uuid();
        acc[idToUse] = {
          ...(state.guides[idToUse] || {}),
          ...guide,
          id: idToUse
        };
        return acc;
      }, {});

      return {
        ...state,
        guides: {
          ...state.guides,
          ...newGuides
        }
      };
    },
    [deleteGuides]: (state, payload) => {
      let ids;
      if (Array.isArray(payload)) {
        ids = payload.map(val => {
          return val.id || val;
        });
      } else {
        ids = [payload.id || payload];
      }
      return { guides: omit(state.guides, ids) };
    },
    [clearGuides]: () => {
      return { guides: {} };
    }
  },
  {
    options: {},
    guides: {}
  }
);
