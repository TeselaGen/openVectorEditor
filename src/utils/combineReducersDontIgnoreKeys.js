export default function combineReducersDontIgnoreKeys(reducers) {
  return function(state = {}, action) {
    const newState = Object.keys(reducers).reduce((acc, key) => {
      acc[key] = reducers[key](state[key], action);
      return acc;
    }, {});
    return {
      ...state,
      ...newState
    };
  };
}
