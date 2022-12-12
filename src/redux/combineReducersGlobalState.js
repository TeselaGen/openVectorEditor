function checkReducersValidity(reducers) {
  for (const key of Object.keys(reducers)) {
    const reducer = reducers[key];
    const type =
      "@@combine-reducers-global-state/RANDOM_ACTION_" +
      Math.random().toString(36).substring(7).split("").join(".");

    if (reducer(undefined, { type }) === undefined) {
      throw new Error(
        `Reducer "${key}" must return initial state when passed undefined state.`
      );
    }
  }
}

export default function combineReducers(reducers) {
  const finalReducers = {};
  for (const key of Object.keys(reducers)) {
    if (typeof reducers[key] === "function") {
      finalReducers[key] = reducers[key];
    }
  }

  let error;
  try {
    checkReducersValidity(finalReducers);
  } catch (e) {
    error = e;
  }

  const finalReducerKeys = Object.keys(finalReducers);

  return function combination(state = {}, action, globalState = state) {
    if (error) throw error;

    let hasChanged = false;
    const nextState = {};
    for (const key of finalReducerKeys) {
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action, globalState);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
