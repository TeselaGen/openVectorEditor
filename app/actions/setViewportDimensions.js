var tree = require('../baobabTree');
var deepEqual = require('deep-equal');
module.exports = function setCaretPosition(newViewportDimensions) {
	if (newViewportDimensions.width > 0 && newViewportDimensions.height > 0) {
		var viewportDimensions = tree.select('vectorEditorState', 'viewportDimensions');
		if (!deepEqual(viewportDimensions.get(), newViewportDimensions)) {
			viewportDimensions.set(newViewportDimensions);
			tree.select('vectorEditorState', 'rowViewDimensions').set({
				height: newViewportDimensions.height * 0.7,
				width: newViewportDimensions.width * 0.7
			});
			tree.select('vectorEditorState', 'charWidth').set(Math.floor(newViewportDimensions.width/50));
		}
	}
};