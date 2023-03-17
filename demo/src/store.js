//optionally connect to the redux store
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { reducer as form } from "redux-form";

const composeEnhancer =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionsDenylist: ["HOVEREDANNOTATIONUPDATE", "HOVEREDANNOTATIONCLEAR"],
      // actionSanitizer,
      latency: 1000,
      name: "openVE"
    })) ||
  compose;

const store = createStore(
  combineReducers({
    form,
  }),
  undefined,
  composeEnhancer(
    applyMiddleware(thunk) //your store should be redux-thunk connected for the VectorEditor component to work
  )
);

export default store;
