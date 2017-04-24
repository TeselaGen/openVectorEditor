//./caretPosition.js
import { createReducer } from 'redux-act'
import createAction from './utils/createMetaAction'

// ------------------------------------
// Actions
// ------------------------------------
export const minimumOrfSizeUpdate = createAction('minimumOrfSizeUpdate')

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer({
  [minimumOrfSizeUpdate]: (state,payload) => {
    if (payload === undefined) debugger;
    return payload
  },
}, 300)

export function getMinimumOrfSize (state) {
  return state
}
