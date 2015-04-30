var tree = require('../baobabTree');

var actions = {
	changeViewportSize: function (newSize) {
		console.log(newSize);
		// tree.select
		var viewportDimensions = tree.select('vectorEditorState', 'visibilityParameters', 'viewportDimensions');
		viewportDimensions.set(newSize);
	}
};

module.exports = actions;