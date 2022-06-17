import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

//this determines whether or not to
const initialSupportedTypes = {
  parts: true,
  features: true,
  translations: true,
  primers: true,
  cutsites: true,
  orfs: true,
  warnings: true,
  assemblyPieces: true,
  lineageAnnotations: true
};

// ------------------------------------
// Actions
// ------------------------------------
export const annotationSupportToggle = createAction("annotationSupportToggle");
//eg: annotationSupportToggle('features')
export const annotationSupportOn = createAction("annotationSupportOn");
export const annotationSupportOff = createAction("annotationSupportOff");

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [annotationSupportToggle]: (state, payload) => {
      return {
        ...state,
        [payload]: !state[payload]
      };
    },
    [annotationSupportOn]: (state, payload) => {
      return {
        ...state,
        [payload]: false
      };
    },
    [annotationSupportOff]: (state, payload) => {
      return {
        ...state,
        [payload]: true
      };
    }
  },
  initialSupportedTypes
);

// import createAction from "./utils/createMetaAction";
// import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

// //this determines whether or not to
// const initialSupportedTypes = {
//   parts: true,
//   features: true,
//   translations: true,
//   primers: true,
//   cutsites: true,
//   orfs: true,
//   warnings: true,
//   assemblyPieces: true,
//   lineageAnnotations: true
// };

// // ------------------------------------
// // Actions
// // ------------------------------------
// export const annotationSupportToggle = createAction(
//   "ANNOTATION_SUPPORT_TOGGLE"
// );

// export const annotationSupportOn = createAction("ANNOTATION_SUPPORT_ON");
// export const annotationSupportOff = createAction("ANNOTATION_SUPPORT_OFF");

// export default function (state = initialSupportedTypes, action) {
//   switch (action.type) {
//     case "ANNOTATION_SUPPORT_TOGGLE":
//       return {
//         ...state,
//         [action.payload]: !state[action.payload]
//       };
//     case "ANNOTATION_SUPPORT_ON":
//       return {
//         ...state,
//         [action.payload]: true
//       };
//     case "ANNOTATION_SUPPORT_OFF":
//       return {
//         ...state,
//         [action.payload]: false
//       };
//     default:
//       if (action.mergeStateDeep) {
//         return {
//           ...initialSupportedTypes,
//           ...state
//         };
//       }
//       return state;
//   }
// }
