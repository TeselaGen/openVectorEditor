import {
  getDiffFromSeqs,
  patchSeqWithDiff,
  reverseSeqDiff
} from "ve-sequence-utils";

// ************************************************************************************************ //
//vectorEditorMiddleware
//used to add undo/redo abilities to OVE

// To Batch actions together use this api:
// deleteFeature([id1, id2], {
//   batchUndoStart: true
// });
// upsertFeature(
// {
//   ...feat1,
//   id: uuid(),
//   start: start - 1,
//   end: end - 1,
//   name
// },
// {
//   batchUndoEnd: true
// }
// );
// ************************************************************************************************ //

export default store => next => action => {
  if (action.meta && action.meta.disregardUndo) {
    return next(action);
  }
  const disregardUndo = true;
  if (action.type === "VE_UNDO" || action.type === "VE_REDO") {
    const { VectorEditor } = store.getState();
    const editorName = action.meta.editorName;
    const editorState = VectorEditor[editorName];
    const stack =
      editorState.sequenceDataHistory[
        action.type === "VE_UNDO" ? "past" : "future"
      ] || [];
    const stackItem = stack[stack.length - 1];
    const newSeqData = patchSeqWithDiff(
      editorState.sequenceData,
      stackItem.sequenceDataDiff
    );
    const sequenceDataDiff = reverseSeqDiff(stackItem.sequenceDataDiff);
    store.dispatch({
      type: action.type === "VE_UNDO" ? "VE_UNDO_META" : "VE_REDO_META",
      payload: {
        ...stackItem, 
        sequenceDataDiff,
        selectionLayer: editorState.selectionLayer,
        caretPosition: editorState.caretPosition
      },
      meta: { editorName, disregardUndo }
    });
    store.dispatch({
      type: "SEQUENCE_DATA_UPDATE",
      payload: newSeqData,
      meta: { editorName, disregardUndo }
    });
    if (stackItem.caretPosition > -1) {
      store.dispatch({
        type: "CARET_POSITION_UPDATE",
        payload: stackItem.caretPosition,
        meta: { editorName, disregardUndo }
      });
    } else {
      store.dispatch({
        type: "SELECTION_LAYER_UPDATE",
        payload: { ...stackItem.selectionLayer, forceUpdate: Math.random() },
        meta: { editorName, disregardUndo }
      });
    }
    store.dispatch({
      type: "VE_SEQUENCE_CHANGED", //used for external autosave functionality
      payload: {
        sequenceData: stackItem.sequenceData, //tnrtodo is this working?
        editorName
      },
      meta: { editorName, disregardUndo: true }
    });
    return next(action);
  } else {
    //pass batchUndoStart, batchUndoMiddle and batchUndoEnd to group actions together
    const { batchUndoEnd, batchUndoStart, batchUndoMiddle } = action.meta || {};
    //get editor state(s)
    const OldVectorEditor = store.getState().VectorEditor;
    let result = next(action);
    const NewVectorEditor = store.getState().VectorEditor;
    Object.keys(NewVectorEditor).forEach(editorName => {
      const newEditorState = NewVectorEditor[editorName];
      const oldEditorState = OldVectorEditor[editorName];
      if (
        oldEditorState &&
        oldEditorState.sequenceData &&
        oldEditorState.sequenceData !== newEditorState.sequenceData
      ) {
        const { sequenceData, selectionLayer, caretPosition,  } = oldEditorState;
        const sequenceDataDiff = getDiffFromSeqs(
          newEditorState.sequenceData,
          sequenceData
        );
        !batchUndoEnd &&
          !batchUndoMiddle &&
          store.dispatch({
            type: "ADD_TO_UNDO_STACK",
            payload: {
              selectionLayer,
              sequenceDataDiff,
              caretPosition,
              stateTrackingId: sequenceData.stateTrackingId
            },
            meta: { editorName, disregardUndo }
          });
        !batchUndoStart &&
          !batchUndoMiddle &&
          store.dispatch({
            type: "VE_SEQUENCE_CHANGED", //used for external autosave functionality
            payload: {
              sequenceData: newEditorState.sequenceData,
              editorName
            },
            meta: { editorName, disregardUndo: true }
          });
      }
    });
    return result;
  }
};
