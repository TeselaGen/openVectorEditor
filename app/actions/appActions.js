var tree = require('../baobabTree');
var _ = require('lodash');
var arePositiveIntegers = require('../arePositiveIntegers');
// var splice = require("underscore.string/splice");
// var getOverlapsOfPotentiallyCircularRanges = require('./getOverlapsOfPotentiallyCircularRanges');
var adjustRangeToDeletionOfAnotherRange = require('../adjustRangeToDeletionOfAnotherRange');
var adjustRangeToSequenceInsert = require('../adjustRangeToSequenceInsert');
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
	//takes in either (int,int) or ({start:int,end:int})
	setVisibleRows: function(newVisibleRows) {
		if (newVisibleRows && arePositiveIntegers(newVisibleRows.start, newVisibleRows.end)) {
			console.log('newVisibleRows: ' + newVisibleRows);
			var previousVisibleRows = tree.select('vectorEditorState', 'visibleRows').get();
			if (previousVisibleRows.start !== newVisibleRows.start || previousVisibleRows.end !== newVisibleRows.end)
			tree.select('vectorEditorState', 'visibleRows').set(newVisibleRows);
			tree.commit();
		} else {
			console.warn("visibleRows object is missing or invalid")
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
			if (newSelectionLayerRange) {
				this.setSelectionLayer(newSelectionLayerRange.start, newSelectionLayerRange.end);
			} else {
				this.setSelectionLayer(false);
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
		var newSequenceData = {};
		if (sequenceData.sequence) {
			//splice the underlying sequence
			newSequenceData.sequence = spliceString(sequenceData.sequence, rangeToDelete.start, deletionLength);
		}
		//trim and remove features
		if (sequenceData.features) {
			newSequenceData.features = _.map(sequenceData.features, function(annotation) {
				var newAnnotationRange = adjustRangeToDeletionOfAnotherRange(annotation, rangeToDelete);
				if (newAnnotationRange) {
					var adjustedAnnotation = annotation;
					adjustedAnnotation.start = newAnnotationRange.start;
					adjustedAnnotation.end = newAnnotationRange.end;
					return adjustedAnnotation;
				}
			}).filter(function(annotation) { //strip out deleted (null) annotations
				if (annotation) {
					return true;
				}
			});
		}
		if (sequenceData.parts) {
			newSequenceData.parts = _.map(sequenceData.parts, function(annotation) {
				var newAnnotationRange = adjustRangeToDeletionOfAnotherRange(annotation, rangeToDelete);
				if (newAnnotationRange) {
					var adjustedAnnotation = annotation;
					adjustedAnnotation.start = newAnnotationRange.start;
					adjustedAnnotation.end = newAnnotationRange.end;
					return adjustedAnnotation;
				}
			}).filter(function(annotation) { //strip out deleted (null) annotations
				if (annotation) {
					return true;
				}
			});
		}
		// console.log('sequenceData.sequence.length: ' + sequenceData.sequence.length);
		// console.log('newSequenceData.sequence.length: ' + newSequenceData.sequence.length);
		tree.select('vectorEditorState', 'sequenceData').set(newSequenceData);
	},

	insertSequenceString: function(sequenceString) {
		if (!sequenceString || !sequenceString.length) {
			console.warn("must pass a valid sequence string");
			return;
		}
		//check for initial values
		var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
		
		//delete the any seleted sequence
		if (selectionLayer && selectionLayer.sequenceSelected && arePositiveIntegers(selectionLayer.start, selectionLayer.end)) {
			this.deleteSequence(selectionLayer);
		}
		//insert new sequence at the caret position
		var caretPosition = tree.select('vectorEditorState', 'caretPosition').get(); //important that we get the caret position only after the deletion occurs!
		if (arePositiveIntegers(caretPosition)) { 
			//tnr: maybe refactor the following so that it doesn't rely on caret position directly, instead just pass in the bp position as a param to a more generic function
			var sequenceData = tree.select('vectorEditorState', 'sequenceData').get();
			var newSequenceData = {};
			if (sequenceData.sequence) {
				//splice the underlying sequence
				newSequenceData.sequence = spliceString(sequenceData.sequence, caretPosition, 0, sequenceString);
			}
			if (sequenceData.features) {
				newSequenceData.features = _.map(sequenceData.features, function(annotation) {
					var newAnnotationRange = adjustRangeToSequenceInsert(annotation, caretPosition, sequenceString.length);
					if (newAnnotationRange) {
						var adjustedAnnotation = annotation;
						adjustedAnnotation.start = newAnnotationRange.start;
						adjustedAnnotation.end = newAnnotationRange.end;
						return adjustedAnnotation;
					}
				});
			}
			if (sequenceData.parts) {
				newSequenceData.parts = _.map(sequenceData.parts, function(annotation) {
					var newAnnotationRange = adjustRangeToSequenceInsert(annotation, {start: caretPosition, end: sequenceString.length});
					if (newAnnotationRange) {
						var adjustedAnnotation = annotation;
						adjustedAnnotation.start = newAnnotationRange.start;
						adjustedAnnotation.end = newAnnotationRange.end;
						return adjustedAnnotation;
					}
				});
			}
			// console.log('sequenceData.sequence.length: ' + sequenceData.sequence.length);
			// console.log('newSequenceData.sequence.length: ' + newSequenceData.sequence.length);
			tree.select('vectorEditorState', 'sequenceData').set(newSequenceData);
			tree.commit();
		} else {
			console.warn('nowhere to put the inserted sequence..');
			return;
		}
		//insert the sequence


		// tree.select('vectorEditorState', 'selectionLayer').set({});
		// viewportDimensions.set(newSize);
	},
	keyPressedInEditor: function(event) {
		event.preventDefault();
		if (event) {
		}
		// tree.select('vectorEditorState', 'selectionLayer').set({});
		// viewportDimensions.set(newSize);
	},
};

module.exports = actions;