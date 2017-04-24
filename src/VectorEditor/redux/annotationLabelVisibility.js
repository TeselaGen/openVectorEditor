import {visibilityInitialValues} from './annotationVisibility'

//./caretPosition.js
import { createReducer } from 'redux-act'
import createAction from './utils/createMetaAction'

// ------------------------------------
// Actions
// ------------------------------------
export const toggleAnnotationLabelVisibility = createAction('toggleAnnotationLabelVisibility')

// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer({
  [toggleAnnotationLabelVisibility]: (state, payload) => {
    return {
      ...state,
      [payload]: !state[payload]
    }
  },
}, visibilityInitialValues)
