import createAction from "../redux/utils/createMetaAction";
import createMergedDefaultStateReducer from "../redux/utils/createMergedDefaultStateReducer";
// ------------------------------------
// Actions
// ------------------------------------
export const openToolbarItemUpdate = createAction("openToolbarItemUpdate");

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    
    [openToolbarItemUpdate]: (state, payload) => {
      return {
        ...state,
        openItem: payload
      };
    },
   
  },
  {
    openItem: "",
  }
);
