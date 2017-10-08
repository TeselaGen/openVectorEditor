//optionally connect to the redux store
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import {vectorEditorReducer as VectorEditor} from '../../src'
import thunk from 'redux-thunk';
import exampleSequenceData from './exampleSequenceData';

const composeEnhancer = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
	actionsBlacklist: ['HOVEREDANNOTATIONUPDATE', 'HOVEREDANNOTATIONCLEAR']
})) || compose;

const store = createStore(
  combineReducers({
    VectorEditor: VectorEditor({DemoEditor: {sequenceData: exampleSequenceData}})
  }),
  undefined,
  composeEnhancer(
  	  applyMiddleware(thunk) //your store should be redux-thunk connected for the VectorEditor component to work
  	)
)

export default store