var tree = require('../baobabTree');
var arePositiveIntegers = require('../arePositiveIntegers');

var actions = {
	changeViewportSize: function (newSize) {
		console.log(newSize);
		// tree.select
		var viewportDimensions = tree.select('vectorEditorState', 'viewportDimensions');
		viewportDimensions.set(newSize);
	},
	setCursorPosition: function (newPosition) {
		tree.select('vectorEditorState', 'cursorPosition').set(newPosition);
		// viewportDimensions.set(newSize);
	},
	setSelectionLayer: function (x1,x2) {
		if (arePositiveIntegers(x1,x2) && arguments.length === 2) {
			tree.select('vectorEditorState', 'selectionLayer').set({start: x1, end: x2, sequenceSelected: true});
		} else {
			tree.select('vectorEditorState', 'selectionLayer').set({start: -1, end: -1, sequenceSelected: false,});
		}
		// viewportDimensions.set(newSize);
	},
	setAverageRowHeight: function (averageRowHeight) {
		if (arePositiveIntegers(averageRowHeight)) {
			tree.select('vectorEditorState', 'averageRowHeight').set(averageRowHeight);
		} 
	},
	setPreloadRowStart: function (preloadRowStart) {
		if (arePositiveIntegers(preloadRowStart)) {
			tree.select('vectorEditorState', 'preloadRowStart').set(preloadRowStart);
		} 
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