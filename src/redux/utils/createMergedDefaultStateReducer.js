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
  defaultState
) {
  const reducer = createReducer(handlers);
  function enhancedReducer(newState = {}, action) {
    const stateToUse =
      action &&
      (action.type === "VECTOR_EDITOR_UPDATE" ||
        (action.meta && action.meta.mergeStateDeep))
        ? {
            ...defaultState,
            ...newState
          }
        : newState;
    return reducer(stateToUse, action);
  }
  enhancedReducer.__shouldUseMergedState = true;
  return enhancedReducer;
}
