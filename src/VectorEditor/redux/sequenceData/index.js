import createAction from '../utils/createMetaAction'
import features from './features';
import primers from './primers';
import sequence from './sequence';
import translations from './translations';
import combineReducers from '../../../../redux/utils/combineReducers';
import cleanSequenceData from '../../utils/cleanSequenceData'
export * from './sharedActionCreators';
export * from './primers';
export * from './features';
export * from './sequence';
export * from './circular';
export * from './translations';
import { createReducer } from 'redux-act'


// ------------------------------------
// Actions
// ------------------------------------

const _updateSequenceData = createAction('SEQUENCE_DATA_UPDATE')
export const updateSequenceData = function (seqData, ...rest) {
	return _updateSequenceData(cleanSequenceData(seqData), ...rest)
}


// ------------------------------------
// Reducer
// ------------------------------------
export default function (state, action) {
	var stateToPass = state
	if (action.type === 'SEQUENCE_DATA_UPDATE') {
		stateToPass = action.payload
	}
	return combineReducers({
		primers,
		features,
		sequence,
		circular: createReducer({}, true),
		translations,
		name: createReducer({}, ''),
		fromFileUpload: createReducer({}, false),
	})(stateToPass, action)
} 
