import { isFunction } from "lodash";
import { createReducer } from "redux-act";
//simple wrapper function around createReducer to keep around the default state if type === VECTOR_EDITOR_UPDATE or meta.mergeStateDeep=true
// example:
// defaultState = {features: true, parts: true}
// newState = {features: false}
// stateToUse = {features: false, parts: true}
// instead of
// stateToUse = {features: false}
// these will also be handled differently in the reducer. The __shouldUseMergedState
// attribute will make them not clear unless full overwritten
export default function createMergedDefaultStateReducer(
  handlers,
  defaultState,
  afterEachHandler
) {
  const reducer = createReducer(handlers);
  function enhancedReducer(newState = {}, action, globalState) {
    let initialState = defaultState;
    let shouldOverride;
    if (isFunction(defaultState)) {
      [initialState, shouldOverride] = defaultState(
        newState,
        action,
        globalState
      );
    }

    const stateToUse = shouldOverride
      ? { ...newState, ...initialState }
      : action &&
        (action.type === "VECTOR_EDITOR_UPDATE" ||
          (action.meta && action.meta.mergeStateDeep))
      ? {
          ...initialState,
          ...newState
        }
      : newState;
    let toRet = reducer(stateToUse, action, globalState);
    if (toRet === "__RESET__") {
      toRet = initialState;
    }

    if (afterEachHandler && handlers[action.type]) {
      afterEachHandler(toRet, globalState);
    }
    return toRet;
  }
  enhancedReducer.__shouldUseMergedState = true;
  return enhancedReducer;
}
