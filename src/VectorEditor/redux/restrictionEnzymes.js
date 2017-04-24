import {combineReducers} from 'redux'
import { createReducer } from 'redux-act'
import createAction from './utils/createMetaAction'
import specialCutsiteFilterOptions from '../constants/specialCutsiteFilterOptions'
// import takaraEnzymeList from '../../../../enzymeListFull.json';
import takaraEnzymeList from '../../../../takaraEnzymeList.json'
// ------------------------------------
// Actions
// ------------------------------------
export const filteredRestrictionEnzymesUpdate = createAction('FILTERED_RESTRICTION_ENZYMES_UPDATE')
export const filteredRestrictionEnzymesReset = createAction('FILTERED_RESTRICTION_ENZYMES_RESET')
export const filteredRestrictionEnzymesAdd = createAction('FILTERED_RESTRICTION_ENZYMES_ADD')
export const addRestrictionEnzyme = createAction('ADD_RESTRICTION_ENZYME')
export const allRestrictionEnzymesUpdate = createAction('ALL_RESTRICTION_ENZYMES_UPDATE')
// ------------------------------------
// Reducer
// ------------------------------------
var initialState = [specialCutsiteFilterOptions.single]
export default combineReducers({
  filteredRestrictionEnzymes: createReducer({
    [filteredRestrictionEnzymesReset]: (state, payload) => initialState,
    [filteredRestrictionEnzymesUpdate]: (state, payload) => payload,
    [filteredRestrictionEnzymesAdd]: function (state, payload) {
      if (!payload.value || !payload.label) debugger //tnr: it must have these things
      return [
        ...state,
        payload
      ]
    },
  }, initialState),
  allRestrictionEnzymes: createReducer({
  	[addRestrictionEnzyme]: function (state, payload) {
      if (
        !payload.name ||
        !payload.site ||
        !payload.forwardRegex ||
        !payload.reverseRegex ||
        (!payload.topSnipOffset && payload.topSnipOffset !== 0) ||
        (!payload.bottomSnipOffset && payload.bottomSnipOffset !== 0)
      ) debugger //tnr: it should have all these properties
  		return {
  			...state,
  			[payload.name]: payload
  		}
  	},
    [allRestrictionEnzymesUpdate]: (state, payload) => payload,
  }, takaraEnzymeList),
})
