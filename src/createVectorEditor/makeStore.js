//optionally connect to the redux store
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import VectorEditor, { vectorEditorMiddleware } from "../redux";
import thunk from "redux-thunk";
import { reducer as form } from "redux-form";

const makeStore = () => {
  const composeEnhancer =
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        name: "createVectorEditor",
        latency: 1000,
        // serialize: {
        //   replacer: (key, value) => {
        //   }
        // },
        actionsDenylist: ["HOVEREDANNOTATIONUPDATE", "HOVEREDANNOTATIONCLEAR"]
      })) ||
    compose;

  const store = createStore(
    combineReducers({
      form,
      VectorEditor: VectorEditor()
    }),
    undefined,
    composeEnhancer(
      applyMiddleware(thunk, vectorEditorMiddleware) //your store should be redux-thunk connected for the VectorEditor component to work
    )
  );
  return store;
};

export default makeStore;
