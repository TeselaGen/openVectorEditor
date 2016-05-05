export default function bindActionCreatorsWithNamespace(actions, dispatch, namespace) {
	var namespacedActions = {}
	Object.keys(actions).forEach(function(actionName){
		namespacedActions[actionName] = function () {
			dispatch(actions[actionName](...arguments, namespace))
		}
	});
	return namespacedActions
}

