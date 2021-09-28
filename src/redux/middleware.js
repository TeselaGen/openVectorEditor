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

export default (store) => (next) => (action) => {
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
    const stateToUse = stack[stack.length - 1];
    store.dispatch({
      type: action.type === "VE_UNDO" ? "VE_UNDO_META" : "VE_REDO_META",
      payload: {
        sequenceData: editorState.sequenceData,
        selectionLayer: editorState.selectionLayer,
        caretPosition: editorState.caretPosition
      },
      meta: { editorName, disregardUndo }
    });
    store.dispatch({
      type: "SEQUENCE_DATA_UPDATE",
      payload: stateToUse.sequenceData,
      meta: { editorName, disregardUndo }
    });
    if (stateToUse.caretPosition > -1) {
      store.dispatch({
        type: "CARET_POSITION_UPDATE",
        payload: stateToUse.caretPosition,
        meta: { editorName, disregardUndo }
      });
    } else {
      store.dispatch({
        type: "SELECTION_LAYER_UPDATE",
        payload: { ...stateToUse.selectionLayer, forceUpdate: Math.random() },
        meta: { editorName, disregardUndo }
      });
    }
    store.dispatch({
      type: "VE_SEQUENCE_CHANGED", //used for external autosave functionality
      payload: {
        sequenceData: stateToUse.sequenceData,
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
    const result = next(action);
    const NewVectorEditor = store.getState().VectorEditor;
    Object.keys(NewVectorEditor).forEach((editorName) => {
      const newEditorState = NewVectorEditor[editorName];
      const oldEditorState = OldVectorEditor[editorName];
      if (
        oldEditorState &&
        oldEditorState.sequenceData &&
        oldEditorState.sequenceData !== newEditorState.sequenceData
      ) {
        const { sequenceData, selectionLayer, caretPosition } = oldEditorState;
        !batchUndoEnd &&
          !batchUndoMiddle &&
          store.dispatch({
            type: "ADD_TO_UNDO_STACK",
            payload: {
              selectionLayer,
              sequenceData,
              caretPosition
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
