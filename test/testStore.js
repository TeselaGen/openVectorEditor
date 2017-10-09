//optionally connect to the redux store
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { tg_modalState } from "teselagen-react-components";
import { vectorEditorReducer as VectorEditor } from "../src";
import thunk from "redux-thunk";
import { reducer as form } from "redux-form";

const composeEnhancer =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionsBlacklist: ["HOVEREDANNOTATIONUPDATE", "HOVEREDANNOTATIONCLEAR"]
    })) ||
  compose;

const store = createStore(
  combineReducers({
    form,
    tg_modalState,
    VectorEditor: VectorEditor()
  }),
  undefined,
  composeEnhancer(
    applyMiddleware(thunk) //your store should be redux-thunk connected for the VectorEditor component to work
  )
);

export default store;
