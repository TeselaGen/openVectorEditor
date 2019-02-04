import cloneDeep from "lodash/cloneDeep";
import {
  // getCurrentParamsFromUrl,
  setCurrentParamsOnUrl,
  getCurrentParamsFromUrl
} from "teselagen-react-components";
import _ from "lodash";

export function setupOptions({ that, defaultState, props }) {
  const editorDemoState = getCurrentParamsFromUrl(props.history.location);
  // localStorage.editorDemoState = props.history.location.search;
  try {
    that.state = {
      ...defaultState,
      ...editorDemoState
    };
  } catch (e) {
    console.warn(
      `oops setting up options went wrong.. maybe your url is messed up?`
    );
    that.state = {
      ...defaultState
    };
  }
  that.resetDefaultState = () => {
    that.setState({
      ...Object.keys(that.state).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
      ...defaultState
    });
    setCurrentParamsOnUrl({}, that.props.history.replace);
    // localStorage.editorDemoState = JSON.stringify(defaultState);
  };
}

export function setParamsIfNecessary({ that, defaultState }) {
  if (!_.isEqual(that.state, that.oldState)) {
    setCurrentParamsOnUrl(
      difference(that.state, defaultState),
      that.props.history.replace
    );
    that.oldState = cloneDeep(that.state);
  }
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base) {
  function changes(object, base) {
    return _.transform(object, function(result, value, key) {
      if (!_.isEqual(value, base[key])) {
        result[key] =
          _.isObject(value) && _.isObject(base[key])
            ? changes(value, base[key])
            : value;
      }
    });
  }
  return changes(object, base);
}
