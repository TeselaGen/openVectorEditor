import omit from "lodash/omit";
import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";
import bsonObjectid from "bson-objectid";
// ------------------------------------
// Actions
// ------------------------------------
// export const caretPositionClear = createAction('caretPositionClear')
export const createTranslation = createAction("CREATE_TRANSLATION");
export const deleteTranslation = createAction("DELETE_TRANSLATION");

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    [createTranslation]: (state, payload) => {
      if (!payload.id) {
        payload = { ...payload, id: bsonObjectid().toString() };
      }
      return {
        ...state,
        [payload.id]: payload
      };
    },
    [deleteTranslation]: (state, payload) => {
      return omit(state, payload.id);
    }
  },
  {}
);

// function myReducer (state={}, action) {
// 	var newState = {}
// 	if (Array.isArray(state)) {
// 		state.forEach(function(item){
// 			newState[item.id || bsonId()] = item
// 		});
// 	} else {
// 		newState = state
// 	}
// 	if (action.type === 'HELLO WORLD') {
// 		return {newState, hello: 'world'}
// 	}
// 	// etc....

// 	return newState
// }
