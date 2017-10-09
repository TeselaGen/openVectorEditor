import { createAction } from "redux-act";

//this makes it so we can call our actionCreator like: 
//addFeature(myFeatureData, {editorName})
export default function createMetaAction(actionName, payloadHelper) {
  return createAction(actionName, payloadHelper, function(unused, meta) {
    return {
      ...meta,
      editorName: meta.editorName
    };
  });
}
