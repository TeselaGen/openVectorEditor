export default function bindActionCreatorsWithMeta(actions, dispatch, meta) {
  let metaActions = {};
  Object.keys(actions).forEach(function(actionName) {
    metaActions[actionName] = function(firstArg) {
      dispatch(actions[actionName](firstArg, meta));
    };
  });
  return metaActions;
}
