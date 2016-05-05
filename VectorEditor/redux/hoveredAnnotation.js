//./caretPosition.js
import { createReducer } from 'redux-act'
import createAction from './utils/createNamespacedAction'

// ------------------------------------
// Actions
// ------------------------------------
export const hoveredAnnotationUpdate = createAction('hoveredAnnotationUpdate')
export const hoveredAnnotationClear = createAction('hoveredAnnotationClear')

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer({
  [hoveredAnnotationUpdate]: (state,payload) => {
    if (payload === undefined) debugger;
    return payload
  },
  [hoveredAnnotationClear]: (state, payload) => {
    return ''
  },
}, '')

