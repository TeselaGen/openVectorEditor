import { createReducer } from "redux-act";
//simple wrapper function around createReducer to always keep around the default state unless specifically overridden
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
    return reducer(
      {
        ...defaultState,
        ...newState
      },
      action
    );
  }
  enhancedReducer.__shouldUseMergedState = true;
  return enhancedReducer;
}
