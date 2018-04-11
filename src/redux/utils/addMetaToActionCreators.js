export default function addMetaToActionCreators(actions, meta) {
  let metaActions = {};
  Object.keys(actions).forEach(function(actionName) {
    metaActions[actionName] = function(firstArg, additionalMeta) {
      return actions[actionName](firstArg, {
        ...meta,
        ...(additionalMeta || {})
      });
    };
  });
  return metaActions;
}
