import { merge } from "lodash";
import * as createYourOwnEnzyme from "../mobxStore/createYourOwnEnzyme";
import * as showGCContent from "../mobxStore/showGCContent";
import * as annotationLabelVisibility from "../mobxStore/AnnotationLabelVisibility";
import * as annotationsToSupport from "../mobxStore/AnnotationsToSupport";
import * as annotationVisibility from "../mobxStore/AnnotationVisibility";
import * as caretPosition from "./caretPosition";
import * as copyOptions from "../mobxStore/CopyOptions";
import * as deletionLayers from "./deletionLayers";
import * as digestTool from "../mobxStore/DigestTool";
import * as findTool from "./findTool";
import * as toolBar from "../mobxStore/toolBar";
import * as frameTranslations from "../mobxStore/FrameTranslations";
import * as hoveredAnnotation from "../mobxStore/HoveredAnnotation";
import * as minimumOrfSize from "../mobxStore/MinimumOrfSize";
import * as alignments from "../mobxStore/alignments";
import * as panelsShown from "../mobxStore/PanelsShown";
import * as propertiesTool from "../mobxStore/propertiesTool";
import * as lastSavedId from "../mobxStore/LastSavedId";
import * as readOnly from "./readOnly";
import * as versionHistory from "../mobxStore/versionHistory";
import * as replacementLayers from "./replacementLayers";
import * as restrictionEnzymes from "../mobxStore/restrictionEnzymes";
import * as selectedAnnotations from "../mobxStore/selectedAnnotations";
import * as selectionLayer from "./selectionLayer";
import * as sequenceDataHistory from "../mobxStore/sequenceDataHistory";
import * as sequenceData from "./sequenceData";
import * as useAdditionalOrfStartCodons from "./useAdditionalOrfStartCodons";
import * as uppercaseSequenceMapFont from "../mobxStore/uppercaseSequenceMapFont";
import * as charWidth from "./charWidth";
import * as labelLineIntensity from "../mobxStore/LabelLineIntensity";
import * as labelSize from "../mobxStore/LabelSize";
import * as featureLengthsToHide from "../mobxStore/FeatureLengthsToHide";
import * as partLengthsToHide from "../mobxStore/PartLengthsToHide";
import * as selectedPartTags from "../mobxStore/selectedPartTags";
import { combineReducers } from "redux";
import createAction from "./utils/createMetaAction";
export { default as vectorEditorMiddleware } from "./middleware";

const subReducers = {
  createYourOwnEnzyme,
  annotationLabelVisibility,
  annotationsToSupport,
  annotationVisibility,
  caretPosition,
  copyOptions,
  deletionLayers,
  digestTool,
  toolBar,
  findTool,
  frameTranslations,
  hoveredAnnotation,
  minimumOrfSize,
  panelsShown,
  propertiesTool,
  lastSavedId,
  readOnly,
  versionHistory,
  replacementLayers,
  restrictionEnzymes,
  selectedAnnotations,
  selectionLayer,
  sequenceDataHistory,
  sequenceData,
  useAdditionalOrfStartCodons,
  charWidth,
  uppercaseSequenceMapFont,
  showGCContent,
  labelLineIntensity,
  labelSize,
  partLengthsToHide,
  featureLengthsToHide,
  selectedPartTags
};

const vectorEditorInitialize = createAction("VECTOR_EDITOR_UPDATE");
const vectorEditorClear = createAction("VECTOR_EDITOR_CLEAR");

//export the actions for use elsewhere
export const actions = {
  ...Object.keys(subReducers).reduce(
    (acc, k) => ({
      ...acc,
      ...subReducers[k]
    }),
    {}
  ),
  ...alignments,
  vectorEditorInitialize,
  vectorEditorClear
};

const mergeDeepKeys = [];
//define the reducer
const reducers = {
  ...Object.keys(subReducers).reduce((acc, k) => {
    if (
      subReducers[k].default &&
      subReducers[k].default.__shouldUseMergedState
    ) {
      mergeDeepKeys.push(k);
    }
    return {
      ...acc,
      [k]: subReducers[k].default
    };
  }, {}),
  instantiated: () => true
};

export const editorReducer = combineReducers(reducers);
const customDeepMerge = (state = {}, newState = {}) => {
  return {
    ...state,
    ...newState,
    ...mergeDeepKeys.reduce((acc, key) => {
      acc[key] = merge(state[key], newState[key]);
      return acc;
    }, {})
  };
};

export default function reducerFactory(initialState = {}) {
  // if (!initialState || !Object.keys(initialState).length) {
  //   throw new Error(
  //     "Please pass an initial state to the vector editor reducer like: {DemoEditor: {}}!"
  //   );
  // }
  return function (state = initialState, action) {
    let editorNames;
    const newState = {};
    if (action.meta && action.meta.editorName) {
      editorNames = Array.isArray(action.meta.editorName)
        ? action.meta.editorName
        : [action.meta.editorName];
    }
    let stateToReturn;
    if (editorNames) {
      //we're dealing with an action specific to a given editor
      editorNames.forEach(function (editorName) {
        let currentState = state[editorName];
        if (action.type === "VECTOR_EDITOR_UPDATE") {
          //deep merge certain parts of the exisiting state with the new payload of props
          //(if you want to do a clean wipe, use VECTOR_EDITOR_CLEAR)
          currentState = customDeepMerge(state[editorName], action.payload);
        }
        if (action.type === "VECTOR_EDITOR_CLEAR") {
          currentState = undefined;
        }
        newState[editorName] = editorReducer(currentState, action);
      });
      stateToReturn = {
        ...state,
        ...newState
      };
    } else {
      //just a normal action
      Object.keys(state).forEach(function (editorName) {
        if (editorName === "__allEditorsOptions") return; //we deal with __allEditorsOptions below so don't pass it here
        newState[editorName] = editorReducer(state[editorName], action);
      });
      stateToReturn = newState;
    }
    return {
      ...stateToReturn,
      //these are reducers that are not editor specific (aka shared across editor instances)
      __allEditorsOptions: [
        ["createYourOwnEnzyme", createYourOwnEnzyme],
        ["uppercaseSequenceMapFont", uppercaseSequenceMapFont],
        ["showGCContent", showGCContent],
        ["labelLineIntensity", labelLineIntensity],
        ["labelSize", labelSize],
        ["alignments", alignments]
      ].reduce((acc, [key, val]) => {
        acc[key] = val.default(
          !state.__allEditorsOptions
            ? undefined
            : state.__allEditorsOptions[key],
          action
        );
        return acc;
      }, {})
    };
  };
}

// export const getBlankEditor = (state) => (state.blankEditor)
export const getEditorByName = (state, editorName) => state[editorName];

// export default connect((state, ownProps) => {
//   return {
//     toggled: state.VectorEditor[ownProps.editorName].annotationVisibility.features
//   }
// })()
