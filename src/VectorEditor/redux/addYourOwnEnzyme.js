//./selectionLayer.js
import { createReducer } from 'redux-act'
import createAction from './utils/createMetaAction'
// ------------------------------------
// Actions
// ------------------------------------
export const addYourOwnEnzymeUpdate = createAction('ADD_YOUR_OWN_ENZYME_UPDATE')
export const addYourOwnEnzymeReset = createAction('ADD_YOUR_OWN_ENZYME_RESET')
export const addYourOwnEnzymeClose = createAction('ADD_YOUR_OWN_ENZYME_CLOSE')

// ------------------------------------
// Reducer
// ------------------------------------
var initialValues = {
  name: 'Example Enzyme',
  sequence: 'ggatcc',
  chop_top_index: 1,
  chop_bottom_index: 5,
  inputSequenceToTestAgainst: '',
  isOpen: false,
}
export default createReducer({
  [addYourOwnEnzymeClose]: (state) => {
    return {...state, isOpen: false}
  },
  [addYourOwnEnzymeReset]: (state, payload={}) => {
    return {...initialValues, ...payload}
  },
  [addYourOwnEnzymeUpdate]: (state, payload) => {
    return payload
  },
}, initialValues)
