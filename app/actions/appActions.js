var tree = require('../baobabTree');
var arePositiveIntegers = require('../arePositiveIntegers');
// var splice = require("underscore.string/splice");
// var getOverlapsOfPotentiallyCircularRanges = require('./getOverlapsOfPotentiallyCircularRanges');
var adjustRangeToDeletionOfAnotherRange = require('../adjustRangeToDeletionOfAnotherRange');
var spliceString = require('../spliceString');
var actions = {
	changeViewportSize: function(newSize) {
		console.log(newSize);
		// tree.select
		var viewportDimensions = tree.select('vectorEditorState', 'viewportDimensions');
		viewportDimensions.set(newSize);
	},
	setCursorPosition: function(newPosition) {
		tree.select('vectorEditorState', 'caretPosition').set(newPosition);
		// viewportDimensions.set(newSize);
	},
	//takes in either (int,int) or ({start:int,end:int})
	setSelectionLayer: function(x1, x2) {
		if (x1 && arePositiveIntegers(x1.start, x1.end)) {
			x2 = x1.end;
			x1 = x1.start;
		}
		if (arePositiveIntegers(x1, x2) && arguments.length === 2) {
			tree.select('vectorEditorState', 'selectionLayer').set({
				start: x1,
				end: x2,
				sequenceSelected: true
			});
		} else {
			tree.select('vectorEditorState', 'selectionLayer').set({
				start: -1,
				end: -1,
				sequenceSelected: false,
			});
		}
		// viewportDimensions.set(newSize);
	},
	setAverageRowHeight: function(averageRowHeight) {
		if (arePositiveIntegers(averageRowHeight)) {
			tree.select('vectorEditorState', 'averageRowHeight').set(averageRowHeight);
		}
	},
	setPreloadRowStart: function(preloadRowStart) {
		if (arePositiveIntegers(preloadRowStart)) {
			tree.select('vectorEditorState', 'preloadRowStart').set(preloadRowStart);
		}
	},
	setMouseIsDown: function(trueOrFalse) {
		tree.select('vectorEditorState', 'mouse', 'isDown').set(trueOrFalse);
		// viewportDimensions.set(newSize);
	},
	cancelSelection: function() {
		tree.select('vectorEditorState', 'selectionLayer').set({});
		// viewportDimensions.set(newSize);
	},
	deleteSequence: function(rangeToDelete) {

		if (!rangeToDelete || !arePositiveIntegers(rangeToDelete.start, rangeToDelete.end)) {
			console.warn('can\'t delete sequence due to invalid start and end');
		}
		var deletionLength = rangeToDelete.end - rangeToDelete.start + 1;
		var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
		var caretPosition = tree.select('vectorEditorState', 'caretPosition').get();
		//update selection layer due to sequence deletion
		if (selectionLayer && selectionLayer.sequenceSelected && arePositiveIntegers(selectionLayer.start, selectionLayer.end)) {
			var newSelectionLayerRange = adjustRangeToDeletionOfAnotherRange(selectionLayer, rangeToDelete);
			this.setSelectionLayer(newSelectionLayerRange);
			if (!newSelectionLayerRange) {
				//update the cursor
				this.setCursorPosition(rangeToDelete.start);
			}
		} else if (tree.select('vectorEditorState', 'caretPosition').get()) {
			//update the cursor position
			this.setCursorPosition(tree.select('vectorEditorState', 'caretPosition').get() - rangeToDelete.start);
		} else {
			console.warn('must have a selection layer or a caretPosition')
		}
		var sequenceData = tree.select('vectorEditorState', 'sequenceData').get();
		if (sequenceData.sequence) {
			//splice the underlying sequence
			var newSequence = spliceString(sequenceData.sequence, rangeToDelete.start, deletionLength);
			tree.select('vectorEditorState', 'sequenceData', 'sequence').set(newSequence);
		}
		//trim and remove features
		
	},

	insertSequenceString: function(sequenceString) {
		//check for initial values
		var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
		var caretPosition = tree.select('vectorEditorState', 'caretPosition').get();
		if (selectionLayer && selectionLayer.sequenceSelected && arePositiveIntegers(selectionLayer.start, selectionLayer.end)) {
			this.deleteSequence(selectionLayer);
		} else if (arePositiveIntegers(caretPosition)) {
			
		} else {
			console.warn('nowhere to put the inserted sequence..');
		}
		// tree.select('vectorEditorState', 'selectionLayer').set({});
		// viewportDimensions.set(newSize);
	},
	keyPressedInEditor: function(event) {
		event.preventDefault();
		if (event) {
			debugger;
		}
		// tree.select('vectorEditorState', 'selectionLayer').set({});
		// viewportDimensions.set(newSize);
	},
};

module.exports = actions;