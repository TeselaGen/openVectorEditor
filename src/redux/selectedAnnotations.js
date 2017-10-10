import {convertRangeTo1Based} from 've-range-utils';
import getReverseComplementSequenceString
  from "ve-sequence-utils/getReverseComplementSequenceString";
import getSequenceWithinRange from "ve-range-utils/getSequenceWithinRange";
import sequenceSelector from "../selectors/sequenceSelector";
import Clipboard from "clipboard";
import basicContext from "basiccontext";
import "basiccontext/dist/basicContext.min.css";
import "basiccontext/dist/themes/default.min.css";
import without from "lodash/without";
import sequenceLengthSelector from "../selectors/sequenceLengthSelector";
//./caretPosition.js
import updateSelectionOrCaret
  from "../utils/selectionAndCaretUtils/updateSelectionOrCaret";
import { createReducer } from "redux-act";
import createAction from "./utils/createMetaAction";
import * as caretPositionActions from "./caretPosition";
import * as selectionLayerActions from "./selectionLayer";

import bindActionCreatorsWithMeta from "./utils/bindActionCreatorsWithMeta";
// ------------------------------------
// Actions
// ------------------------------------
// export const anno = createAction('VE_ANNOTATION_CLICK')
export const annotationSelect = createAction("VE_ANNOTATION_SELECT");
export const updateSelectedAnnotation = createAction(
  "VE_ANNOTATION_UPDATE_SELECTED"
);
export const annotationDeselect = createAction("VE_ANNOTATION_DESELECT");
export const annotationDeselectAll = createAction("VE_ANNOTATION_DESELECT_ALL");

let annotationSelectionActions = {
  annotationSelect,
  annotationDeselect,
  updateSelectedAnnotation,
  annotationDeselectAll
};

// ------------------------------------
// Thunks
// ------------------------------------
export function cutsiteClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, getState) {
    let args = { event, annotation, meta, dispatch, getState };
    updateSelectionOrCaretBasedOnAnnotation(args);
    dispatch(annotationDeselectAll(undefined, meta));
    dispatch(annotationSelect(annotation, meta));
  };
}

export function featureClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, getState) {
    let args = { event, annotation, meta, dispatch, getState };
    updateSelectionOrCaretBasedOnAnnotation(args);
    dispatch(annotationDeselectAll(undefined, meta));
    dispatch(annotationSelect(annotation, meta));
  };
}

export function featureRightClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, getState) {
    const editorName = meta.editorName
    const editorState = getState().VectorEditor[editorName];
    const { readOnly } = editorState;

    let items = [
      ...readOnly ? [] : [{
        title: "Create Feature",
        fn: function() {
          dispatch({
            type: "TG_SHOW_MODAL",
            name: "AddOrEditFeatureDialog", //you'll need to pass a unique dialogName prop to the compoennt
            props: {
              editorName,
              dialogProps: {
                title: 'Edit Feature'
              },
              initialValues: {
                ...convertRangeTo1Based(annotation)
              }
            }
          });
        }
      }],
      {
        title: "View Translation",
        icon: "ion-plus-round",
        fn: function() {
          dispatch({
            type: "CREATE_TRANSLATION",
            meta,
            payload: {
              start: annotation.start,
              end: annotation.end,
              forward: annotation.forward
            }
          });
        }
      }
    ];

    basicContext.show(items, event);
  };
}

export function primerClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, getState) {
    let args = { event, annotation, meta, dispatch, getState };
    updateSelectionOrCaretBasedOnAnnotation(args);
    dispatch(annotationDeselectAll(undefined, meta));
    dispatch(annotationSelect(annotation, meta));
  };
}

export function primerRightClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, /* getState */) {
    let items = [
      {
        title: "View Translation",
        icon: "ion-plus-round",
        fn: function() {
          dispatch({
            type: "CREATE_TRANSLATION",
            meta,
            payload: {
              start: annotation.start,
              end: annotation.end,
              forward: annotation.forward
            }
          });
        }
      }
    ];
    basicContext.show(items, event);
  };
}

export function orfClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, getState) {
    let args = { event, annotation, meta, dispatch, getState };
    updateSelectionOrCaretBasedOnAnnotation(args);
    dispatch(annotationDeselectAll(undefined, meta));
    dispatch(annotationSelect(annotation, meta));
  };
}

export function translationClicked({ event, codonRange, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, getState) {
    let args = { event, annotation: codonRange, meta, dispatch, getState };
    updateSelectionOrCaretBasedOnAnnotation(args);
    dispatch(annotationDeselectAll(undefined, meta));
    // dispatch(annotationSelect(annotation, meta))
  };
}

export function translationRightClicked(
  { event, codonRange, annotation },
  meta
) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, /* getState */) {
    if (annotation.isOrf) {
      return;
    }
    let items = [
      {
        title: "Delete Translation",
        icon: "ion-plus-round",
        fn: function() {
          dispatch({
            type: "DELETE_TRANSLATION",
            meta,
            payload: annotation
          });
        }
      }
    ];
    basicContext.show(items, event);
  };
}

export function translationDoubleClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, getState) {
    let args = { event, annotation, meta, dispatch, getState };
    updateSelectionOrCaretBasedOnAnnotation(args);
    dispatch(annotationDeselectAll(undefined, meta));
    dispatch(annotationSelect(annotation, meta));
  };
}

export function deletionLayerClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, getState) {
    let args = { event, annotation, meta, dispatch, getState };
    updateSelectionOrCaretBasedOnAnnotation(args);
    dispatch(annotationDeselectAll(undefined, meta));
    dispatch(annotationSelect(annotation, meta));
  };
}

export function deletionLayerRightClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, /* getState */) {
    let items = [
      {
        title: "Remove Deletion",
        icon: "ion-plus-round",
        fn: function() {
          dispatch({
            type: "DELETION_LAYER_DELETE",
            meta,
            payload: { ...annotation }
          });
        }
      }
    ];

    basicContext.show(items, event);
  };
}

export function replacementLayerClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, getState) {
    let args = { event, annotation, meta, dispatch, getState };
    updateSelectionOrCaretBasedOnAnnotation(args);
    dispatch(annotationDeselectAll(undefined, meta));
    dispatch(annotationSelect(annotation, meta));
  };
}

export function replacementLayerRightClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, /* getState */) {
    let items = [
      {
        title: "Remove Edit",
        icon: "ion-plus-round",
        fn: function() {
          dispatch({
            type: "REPLACEMENT_LAYER_DELETE",
            meta,
            payload: { ...annotation }
          });
        }
      }
    ];

    basicContext.show(items, event);
  };
}

export function selectionLayerRightClicked(
  { event, annotation, extraItems = [] },
  meta
) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, getState) {
    const editorName = meta.editorName
    const editorState = getState().VectorEditor[editorName];
    const sequence = sequenceSelector(editorState);
    const { selectionLayer, readOnly } = editorState;
    const selectedSeq = getSequenceWithinRange(selectionLayer, sequence);
    function makeTextCopyable(stringToCopy) {
      let text = "";
      let clipboard = new Clipboard(".basicContext", {
        text: function() {
          return stringToCopy;
        }
      });
      clipboard.on("success", function() {
        if (text.length === 0) {
          console.log("No Sequence To Copy");
        } else {
          console.log("Selection Copied!");
        }
      });
      clipboard.on("error", function() {
        console.error("Error copying selection.");
      });
    }
    let items = [
      {
        title: "Copy",
        fn: function() {
          makeTextCopyable(selectedSeq);
        }
      },
      {
        title: "Copy Reverse Complement",
        fn: function() {
          makeTextCopyable(getReverseComplementSequenceString(selectedSeq));
        }
      },
      ...readOnly ? [] : [{
        title: "Create Feature",
        fn: function() {
          dispatch({
            type: "TG_SHOW_MODAL",
            name: "AddOrEditFeatureDialog", //you'll need to pass a unique dialogName prop to the compoennt
            props: {
              editorName,
              dialogProps: {
                title: 'Add Feature'
              }
            }
          });
        }
      }],
      {
        title: "View Translation",
        fn: function() {
          dispatch({
            type: "CREATE_TRANSLATION",
            meta,
            payload: { ...annotation, forward: true }
          });
        }
      },
      {
        title: "View Reverse Translation",
        fn: function() {
          dispatch({
            type: "CREATE_TRANSLATION",
            meta,
            payload: { ...annotation, forward: false }
          });
        }
      },
      ...extraItems

      // { title: 'Reset Login', icon: 'ion-person', fn: clicked },
      // { title: 'Help', icon: 'ion-help-buoy', fn: clicked },
      // { },
      // { title: 'Disabled', icon: 'ion-minus-circled', fn: clicked, disabled: true },
      // { title: 'Invisible', icon: 'ion-eye-disabled', fn: clicked, visible: false },
      // { title: 'Logout', icon: 'ion-log-out', fn: clicked }
    ];

    basicContext.show(items, event);
  };
}

export function orfRightClicked({ event, annotation }, meta) {
  event.preventDefault();
  event.stopPropagation();
  return function(dispatch, /* getState */) {
    let items = [
      {
        title: "View Translation",
        icon: "ion-plus-round",
        fn: function() {
          dispatch({
            type: "CREATE_TRANSLATION",
            meta,
            payload: {
              start: annotation.start,
              end: annotation.end,
              forward: annotation.forward
            }
          });
        }
      }
    ];
    basicContext.show(items, event);
  };
}

export function updateSelectionOrCaretBasedOnAnnotation({
  event = {},
  annotation = {},
  meta,
  dispatch,
  getState
}) {
  let shiftHeld = event.shiftKey;
  let newRangeOrCaret = annotation.caretPosition > -1
    ? annotation.caretPosition
    : annotation.annotationType === "cutsite"
        ? annotation.topSnipPosition
        : { start: annotation.start, end: annotation.end };
  let {
    selectionLayerUpdate,
    caretPositionUpdate
  } = bindActionCreatorsWithMeta(
    {
      ...annotationSelectionActions,
      ...caretPositionActions,
      ...selectionLayerActions
    },
    dispatch,
    meta
  );
  let editorState = getState().VectorEditor[meta.editorName];
  let { caretPosition, selectionLayer } = editorState;
  let sequenceLength = sequenceLengthSelector(editorState);
  updateSelectionOrCaret({
    shiftHeld,
    sequenceLength,
    newRangeOrCaret,
    caretPosition,
    selectionLayer,
    selectionLayerUpdate,
    caretPositionUpdate
  });
}

// annotationDeselectAll()
// annotationSelect(feature)

// export function cutsiteClicked(event, cutsite, meta, options = {}) {
// 	var args1 = arguments
// 	var shiftHeld = event.shiftKey

// 	return function (dispatch, getState) {
// 		var actions = bindActionCreatorsWithMeta({ ...annotationSelectionActions,...caretPositionActions, ...selectionLayerActions}, dispatch, meta)
// 		var {selectionLayerUpdate,
// 			caretPositionUpdate,
// 			annotationSelect,
// 			annotationDeselectAll
// 		} = actions

// 		var editorState = getState().VectorEditor[meta]
// 		var {caretPosition, selectionLayer} = editorState
// 		var sequenceLength = sequenceLengthSelector(editorState)
// 		var updateSelectionOrCaretArgs = {shiftHeld, sequenceLength, newCaret, caretPosition, selectionLayer, selectionLayerUpdate, caretPositionUpdate}
// 		if (options.doSomethingDifferent) {
// 			options.doSomethingDifferent({...arguments, args1, meta, cutsite, editorState, ...actions, ...updateSelectionOrCaretArgs })
// 		} else {
// 			annotationDeselectAll()
// 			annotationSelect(cutsite)
// 			updateSelectionOrCaret(updateSelectionOrCaretArgs)
// 		}

// 	}
// }

// ------------------------------------
// Reducer
// ------------------------------------
const startingState = {
  idMap: {},
  idStack: []
};
export default createReducer(
  {
    [annotationSelect]: (state, payload) => {
      if (!payload.id) throw new Error('Annotation must have an id!');
      let newState = {
        idMap: {
          ...state.idMap,
          [payload.id]: payload
        },
        idStack: [...state.idStack, payload.id]
      };
      return newState;
    },
    [annotationDeselect]: (state, payload) => {
      let id = payload.id || payload;
      let idMap = { ...state.idMap };
      delete idMap[id];
      let idStack = without(state.idStack, id);
      return {
        idMap,
        idStack
      };
    },
    [updateSelectedAnnotation]: (state, payload) => {
      let id = payload.id;
      let idMap = { ...state.idMap };
      if (!idMap[id]) {
        return state;
      }
      return {
        idMap: {
          ...idMap,
          [id]: {
            ...idMap[id],
            ...payload
          }
        },
        idStack: state.idStack
      };
    },
    [annotationDeselectAll]: () => {
      return startingState;
    }
  },
  startingState
);

// // ------------------------------------
// // Selectors
// // ------------------------------------
// export function getSelectedCutsites (state) {
// 	var {idStack, idMap} = state
// 	var cutsiteIdMap = {}
// 	var cutsiteIdStack = idStack.filter(function (id) {
//       if (idMap[id].annotationType === 'cutsite') {
// 	      cutsiteIdMap[id] = idMap[id]
// 	      return true
//       }
//     })
// 	return {
// 		idStack: cutsiteIdStack,
// 		idMap: cutsiteIdMap
// 	}
// }
