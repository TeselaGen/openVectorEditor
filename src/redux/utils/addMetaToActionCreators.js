export default function addMetaToActionCreators(actions, meta) {
  let metaActions = {};
  Object.keys(actions).forEach(function(actionName) {
    metaActions[actionName] = function(firstArg) {
      return actions[actionName](firstArg, meta);
    };
  });
  return metaActions;
}
