import { createReducer } from "redux-act";
//simple wrapper function around createReducer to always keep around the default state unless specifically overridden
// example:
// defaultState = {features: true, parts: true}
// newState = {features: false}
// stateToUse = {features: false, parts: true}
// instead of
// stateToUse = {features: false}
export default function createMergedDefaultStateReducer(
  handlers,
  defaultState
) {
  const reducer = createReducer(handlers);
  return function enhancedReducer(newState = {}, action) {
    return reducer(
      {
        ...defaultState,
        ...newState
      },
      action
    );
  };
}
