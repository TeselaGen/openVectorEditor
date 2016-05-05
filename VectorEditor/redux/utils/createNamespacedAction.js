import {createAction} from 'redux-act';
export default function createVeNamespacedAction(actionName, payloadHelper) {
  return createAction(actionName, payloadHelper, function (unused, namespace) {
    return {
      __VectorEditorInstanceName__: namespace
    }
  })
}