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
    return payload.circular || true
  },
}, true)
