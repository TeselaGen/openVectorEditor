import { createAction } from "redux-act";
export default function createMetaAction(actionName, payloadHelper) {
  return createAction(actionName, payloadHelper, function(unused, meta) {
    return {
      ...meta,
      EditorName: meta.editorName
    };
  });
}
