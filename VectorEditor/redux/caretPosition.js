//./caretPosition.js
import { createReducer } from 'redux-act'
import createAction from './utils/createNamespacedAction'

// ------------------------------------
// Actions
// ------------------------------------
export const clearCaret = createAction('clearCaret')
export const updateCaret = createAction('updateCaret')


var { updateSelectionLayer } = require('./selectionLayer'); //important, keep this here in the order of the file and let it use the commonjs syntax! 
// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer({
  [updateSelectionLayer]: () => {
  	//clear the caret if the selection layer is updated!
    return -1
  },
  [clearCaret]: () => {
    return -1
  },
  [updateCaret]: ({start}, payload) => {
    return typeof payload === 'string' ? parseInt(payload) : payload
  },
}, 0)
