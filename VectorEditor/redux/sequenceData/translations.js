import {updateSequenceData} from './sharedActionCreators';
import { createReducer } from 'redux-act'
import createAction from '../utils/createNamespacedAction'

// ------------------------------------
// Actions
// ------------------------------------
// export const clearCaret = createAction('clearCaret')


// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer({
  [updateSequenceData]: (state, payload) => {
    return payload.translations || {}
  }
}, {})


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
