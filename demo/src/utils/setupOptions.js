import cloneDeep from "lodash/cloneDeep";
import {
  // getCurrentParamsFromUrl,
  setCurrentParamsOnUrl,
  getCurrentParamsFromUrl
} from "teselagen-react-components";
import { transform, isEqual, isObject } from "lodash";

export function setupOptions({ that, defaultState, props }) {
  const editorDemoState = getCurrentParamsFromUrl(props.history.location);
  // localStorage.editorDemoState = props.history.location.search;
  const massagedEditorDemoState = Object.keys(editorDemoState).reduce(
    (acc, key) => {
      if (editorDemoState[key] === "false") {
        acc[key] = false;
      } else if (editorDemoState[key] === "true") {
        acc[key] = true;
      } else {
        acc[key] = editorDemoState[key];
      }
      return acc;
    },
    {}
  );
  try {
    that.state = {
      ...defaultState,
      ...massagedEditorDemoState
    };
  } catch (e) {
    console.warn(
      `oops setting up options went wrong.. maybe your url is messed up?`,
      e
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
  if (!isEqual(that.state, that.oldState)) {
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
    return transform(object, function(result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] =
          isObject(value) && isObject(base[key])
            ? changes(value, base[key])
            : value;
      }
    });
  }
  return changes(object, base);
}
