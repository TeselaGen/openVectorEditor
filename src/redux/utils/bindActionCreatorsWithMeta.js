//basically all we're doing here is auto-binding this object: {editorName: 'someName'}
//as the second arg to any given action
export default function bindActionCreatorsWithMeta(actions, dispatch, meta) {
  let metaActions = {};
  Object.keys(actions).forEach(function(actionName) {
    metaActions[actionName] = function(firstArg) {
      dispatch(actions[actionName](firstArg, meta));
    };
  });
  return metaActions;
}
