//optionally connect to the redux store
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { tg_modalState } from "teselagen-react-components";
import { vectorEditorReducer as VectorEditor } from "../../src";
import thunk from "redux-thunk";
import { reducer as form } from "redux-form";
import exampleSequenceData from "./exampleSequenceData";
import cleanSequenceData from "../../src/utils/cleanSequenceData";

const actionSanitizer = action => {
  try {
    JSON.stringify(action);
  } catch (e) {
    console.error("whoops! You're firing an action that can't be serialized. You shouldn't do that...")
    /* eslint-disable */ 
    debugger;
    /* eslint-enable */ 
  }
};

const composeEnhancer =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionsBlacklist: ["HOVEREDANNOTATIONUPDATE", "HOVEREDANNOTATIONCLEAR"],
      actionSanitizer
    })) ||
  compose;

const store = createStore(
  combineReducers({
    form,
    tg_modalState,
    VectorEditor: VectorEditor(
      {
        // DemoEditor: {
        //   sequenceData: cleanSequenceData(exampleSequenceData),
        //   readOnly: false
        // }
      }
    )
  }),
  undefined,
  composeEnhancer(
    applyMiddleware(thunk) //your store should be redux-thunk connected for the VectorEditor component to work
  )
);

export default store;
