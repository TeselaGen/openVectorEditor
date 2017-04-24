export default function addMetaToActionCreators(actions, meta) {
	var metaActions = {}
	Object.keys(actions).forEach(function(actionName){
		metaActions[actionName] = function (firstArg) {
			return actions[actionName](firstArg, meta)
		}
	});
	return metaActions
}
