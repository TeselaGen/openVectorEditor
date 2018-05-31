//optionally connect to the redux store
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { tg_modalState } from "teselagen-react-components";
import { vectorEditorReducer as VectorEditor, vectorEditorMiddleware } from "../../src";
import thunk from "redux-thunk";
import { reducer as form } from "redux-form";

// const actionSanitizer = action => {
//   try {
//     JSON.stringify(action);
//   } catch (e) {
//     console.error("whoops! You're firing an action that can't be serialized. You shouldn't do that...")
//     /* eslint-disable */
//     debugger;
//     /* eslint-enable */
//   }
// };

// const composeEnhancer =
//   (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//       actionsBlacklist: ["HOVEREDANNOTATIONUPDATE", "HOVEREDANNOTATIONCLEAR"]
//     })) ||
//   compose;

const composeEnhancer =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionsBlacklist: ["HOVEREDANNOTATIONUPDATE", "HOVEREDANNOTATIONCLEAR"],
      // actionSanitizer,
      latency: 1000,
      name: "openVE"
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
    applyMiddleware(thunk, vectorEditorMiddleware) //your store should be redux-thunk connected for the VectorEditor component to work
  )
);

export default store;

// ​
// const crashReporter = store => next => action => {
//   try {
//     return next(action)
//   } catch (err) {
//     console.error('Caught an exception!', err)
//     Raven.captureException(err, {
//       extra: {
//         action,
//         state: store.getState()
//       }
//     })
//     throw err
//   }
// }
