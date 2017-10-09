//optionally connect to the redux store
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import {tg_modalState} from 'teselagen-react-components';
import VectorEditor from '../redux';
import thunk from 'redux-thunk';
import {reducer as form} from 'redux-form';
import exampleSequenceData from './exampleSequenceData';
import cleanSequenceData from '../utils/cleanSequenceData';


const composeEnhancer = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
	actionsBlacklist: ['HOVEREDANNOTATIONUPDATE', 'HOVEREDANNOTATIONCLEAR']
})) || compose;

const store = createStore(
  combineReducers({
    form,
    tg_modalState,
    VectorEditor: VectorEditor({StandaloneEditor: {sequenceData: cleanSequenceData(exampleSequenceData), readOnly: false}})
  }),
  undefined,
  composeEnhancer(
  	  applyMiddleware(thunk) //your store should be redux-thunk connected for the VectorEditor component to work
  	)
)

export default store