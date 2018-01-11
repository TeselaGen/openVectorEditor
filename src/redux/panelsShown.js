import { map } from "lodash";
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";
import { removeItem } from "../utils/arrayUtils";

// import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
export const panelsShownUpdate = createAction("PANELS_SHOWN_UPDATE");
export const closePanel = createAction("closePanel");
export const setPanelAsActive = createAction("setPanelAsActive");
export const propertiesViewOpen = (unused, meta) => {
  return setPanelAsActive("properties", meta);
};

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [panelsShownUpdate]: (state, payload) => {
      return payload.filter(group => group.length); //filter out any empty groups
    },
    [closePanel]: (state, idToClose) => {
      const newState = state.map(group => {
        let indexToClose;
        group.forEach(({ id }, i) => {
          if (id === idToClose) indexToClose = i;
        });
        if (indexToClose > -1) {
          return removeItem(group, indexToClose).map((tab, i) => {
            if (i === 0) return { ...tab, active: true };
            else {
              return tab;
            }
          });
        }
        return group;
      });
      return newState.filter(group => group.length); //filter out any empty groups
    },
    [setPanelAsActive]: (state, panelId) => {
      return map(state, panelGroup => {
        const isPanelInGroup = panelGroup.some(({ id }) => {
          return panelId === id;
        });
        return panelGroup.map(panel => {
          return {
            ...panel,
            active:
              panelId === panel.id
                ? true
                : isPanelInGroup ? false : panel.active
          };
        });
      });
    }
  },
  [
    [
      {
        id: "sequence",
        name: "Sequence Map",
        active: true
      }
    ],
    [
      // {
      //   id: "digestTool",
      //   name: "New Digest",
      //   active: true,
      //   canClose: true
      // },
      {
        id: "circular",
        name: "Plasmid",
        active: true
      },
      {
        id: "rail",
        name: "Linear Map",
        active: false
      },
      {
        id: "properties",
        name: "Properties",
        active: false
      }
    ]
  ]
);
