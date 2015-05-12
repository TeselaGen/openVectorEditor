var tree = require('../baobabTree');

var actions = {
	changeViewportSize: function (newSize) {
		console.log(newSize);
		// tree.select
		var viewportDimensions = tree.select('vectorEditorState', 'visibilityParameters', 'viewportDimensions');
		viewportDimensions.set(newSize);
	},
	setCursorPosition: function (newPosition) {
		tree.select('vectorEditorState', 'cursorPosition').set(newPosition);
		// viewportDimensions.set(newSize);
	},
	setSelectionLayer: function (newPosition) {
		tree.select('vectorEditorState', 'selectionLayer').set(newPosition);
		// viewportDimensions.set(newSize);
	},
	setMouseIsDown: function (trueOrFalse) {
		tree.select('vectorEditorState', 'mouse', 'isDown').set(trueOrFalse);
		// viewportDimensions.set(newSize);
	},
	cancelSelection: function () {
		tree.select('vectorEditorState', 'selectionLayer').set({});
		// viewportDimensions.set(newSize);
	},
};

module.exports = actions;