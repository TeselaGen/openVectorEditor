//./caretPosition.js
import { createReducer } from 'redux-act'
import createAction from './utils/createNamespacedAction'

// ------------------------------------
// Actions
// ------------------------------------
export const toggleAnnotationVisibility = createAction('toggleAnnotationVisibility')
//eg: toggleAnnotationVisibility('features')
export const hideAnnotation = createAction('hideAnnotation')
export const showAnnotation = createAction('showAnnotation')

// ------------------------------------
// Reducer
// ------------------------------------
var annotationVisibility = createReducer({
  [toggleAnnotationVisibility]: (state, payload) => {
    return {
      ...state,
      [payload]: !state[payload]
    }
  },
}, {
  features: true,
  translations: true,
  parts: true,
  orfs: true,
  axis: true,
  cutsites: true,
  reverseSequence: true,
})

export default annotationVisibility
