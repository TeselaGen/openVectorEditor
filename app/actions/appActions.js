var tree = require('../baobabTree');
var _ = require('lodash');
var deepEqual = require('deep-equal')
var isInteger = require("is-integer");
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
// var splice = require("underscore.string/splice");
// var getOverlapsOfPotentiallyCircularRanges = require('./getOverlapsOfPotentiallyCircularRanges');
var adjustRangeToDeletionOfAnotherRange = require('../adjustRangeToDeletionOfAnotherRange');
var trimNumberToFitWithin0ToAnotherNumber = require('../trimNumberToFitWithin0ToAnotherNumber');
var adjustRangeToSequenceInsert = require('../adjustRangeToSequenceInsert');
var spliceString = require('string-splice');

var actions = {
	changeViewportSize: function(newSize) {
		console.log(newSize);
		// tree.select
		var viewportDimensions = tree.select('vectorEditorState', 'viewportDimensions');
		viewportDimensions.set(newSize);
	},
	setCaretPosition: function(newPosition) {
		if (isInteger(newPosition)) {
			tree.select('vectorEditorState', 'caretPosition').set(newPosition);
		} else {
			tree.select('vectorEditorState', 'caretPosition').set(-1);
		}
	},
	//takes in either (int,int) or ({start:int,end:int})
	setSelectionLayer: function(newSelectionLayer) {
		// if (typeof x1 === 'object' && areNonNegativeIntegers([x1.start, x1.end])) {
		// 	x2 = x1.end;
		// 	x1 = x1.start;
		// 	//if the cursor 
		// 	// cursorAtEnd = true;
		// }
		var getRidOfCursor;
		var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
		if (!newSelectionLayer || typeof newSelectionLayer !== 'object') {
			newSelectionLayer = {
				start: -1,
				end: -1,
				selected: false,
				cursorAtEnd: true
			}
		} else {
			var {
				start, end, selected, cursorAtEnd
			} = newSelectionLayer;
			if (areNonNegativeIntegers([start, end])) {
				newSelectionLayer = {
					start: start,
					end: end,
					selected: true,
					cursorAtEnd: cursorAtEnd
				};
				getRidOfCursor = true;
			} else {
				newSelectionLayer = {
					start: -1,
					end: -1,
					selected: false,
					cursorAtEnd: true
				};
			}
		}
		// if (!deepEqual(selectionLayer, newSelectionLayer)) { //tnrtodo come back here and reinstate this check once baobab has been fixed
			if (getRidOfCursor) {
				this.setCaretPosition(-1);
			}
			tree.select('vectorEditorState', 'selectionLayer').set(newSelectionLayer);
		// }

		// viewportDimensions.set(newSize);
	},
	//takes in an object like: {start:int,end:int}
	setVisibleRows: function(newVisibleRows) {
		if (newVisibleRows && areNonNegativeIntegers([newVisibleRows.start, newVisibleRows.end])) {
			// console.log('newVisibleRows: ' + newVisibleRows);
			var previousVisibleRows = tree.select('vectorEditorState', 'visibleRows').get();
			if (previousVisibleRows.start !== newVisibleRows.start || previousVisibleRows.end !== newVisibleRows.end) {
				tree.select('vectorEditorState', 'visibleRows').set(newVisibleRows);
				tree.commit();
			}
		} else {
			console.warn("visibleRows object is missing or invalid");
		}
		// viewportDimensions.set(newSize);
	},
	setAverageRowHeight: function(averageRowHeight) {
		if (areNonNegativeIntegers([averageRowHeight])) {
			tree.select('vectorEditorState', 'averageRowHeight').set(averageRowHeight);
		}
	},
	setPreloadRowStart: function(preloadRowStart) {
		if (areNonNegativeIntegers([preloadRowStart])) {
			tree.select('vectorEditorState', 'preloadRowStart').set(preloadRowStart);
		}
	},
	// setMouseIsDown: function(trueOrFalse) {
	// 	tree.select('vectorEditorState', 'mouse', 'isDown').set(trueOrFalse);
	// 	// viewportDimensions.set(newSize);
	// },
	// cancelSelection: function() {
	// 	tree.select('vectorEditorState', 'selectionLayer').set({});
	// 	// viewportDimensions.set(newSize);
	// },

	deleteSequence: function(rangeToDelete) {
		if (!rangeToDelete || !areNonNegativeIntegers([rangeToDelete.start, rangeToDelete.end])) {
			console.warn('can\'t delete sequence due to invalid start and end');
		}
		var sequenceLength = tree.facets.sequenceLength.get();
		var deletionLength;
		if (rangeToDelete.start > rangeToDelete.end) {
			deletionLength = sequenceLength - rangeToDelete.start + rangeToDelete.end + 1;
		} else {
			deletionLength = rangeToDelete.end - rangeToDelete.start + 1;
		}
		var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
		//update selection layer due to sequence deletion
		if (selectionLayer && selectionLayer.selected && areNonNegativeIntegers([selectionLayer.start, selectionLayer.end])) {
			var newSelectionLayerRange = adjustRangeToDeletionOfAnotherRange(selectionLayer, rangeToDelete, sequenceLength);
			if (newSelectionLayerRange) {
				this.setSelectionLayer(newSelectionLayerRange);
			} else {
				this.setSelectionLayer(false);
				//update the cursor
				this.setCaretPosition(rangeToDelete.start);
			}
		} else if (tree.select('vectorEditorState', 'caretPosition').get()) {
			//update the cursor position
			this.setCaretPosition(tree.select('vectorEditorState', 'caretPosition').get() - rangeToDelete.start);
		} else {
			console.warn('must have a selection layer or a caretPosition');
		}
		var sequenceData = tree.select('vectorEditorState', 'sequenceData').get();
		var newSequenceData = {};
		if (sequenceData.sequence) {
			//splice the underlying sequence
			if (rangeToDelete.start > rangeToDelete.end) {
				//circular deletion
				newSequenceData.sequence = sequenceData.sequence.slice(rangeToDelete.end + 1, rangeToDelete.start);
			} else {
				//regular deletion
				newSequenceData.sequence = sequenceData.sequence.slice(0, rangeToDelete.start) + sequenceData.sequence.slice(rangeToDelete.end + 1, sequenceLength);
			}
		}
		//trim and remove features
		if (sequenceData.features) {
			newSequenceData.features = _.map(sequenceData.features, function(annotation) {
				var newAnnotationRange = adjustRangeToDeletionOfAnotherRange(annotation, rangeToDelete, sequenceLength);
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
		this.refreshEditor(); //tnrtodo: hacky hack until baobab is fixed completely... this causes the editor to update itself..
	},

	insertSequenceString: function(sequenceString) {
		if (!sequenceString || !sequenceString.length) {
			console.warn("must pass a valid sequence string");
			return;
		}
		//check for initial values
		var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();

		//delete the any selected sequence
		if (selectionLayer && selectionLayer.selected && areNonNegativeIntegers([selectionLayer.start, selectionLayer.end])) {
			this.deleteSequence(selectionLayer);
		}
		//insert new sequence at the caret position
		var caretPosition = tree.select('vectorEditorState', 'caretPosition').get(); //important that we get the caret position only after the deletion occurs!
		if (areNonNegativeIntegers([caretPosition])) {
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
					var newAnnotationRange = adjustRangeToSequenceInsert(annotation, {
						start: caretPosition,
						end: sequenceString.length
					});
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
			console.log('newdata set');
			//update the caret position to be at the end of the newly inserted sequence
			this.setCaretPosition(sequenceString.length + caretPosition);
		} else {
			console.warn('nowhere to put the inserted sequence..');
			return;
		}
		this.refreshEditor(); //tnrtodo: hacky hack until baobab is fixed completely... this causes the editor to update itself..
		//insert the sequence
		// tree.select('vectorEditorState', 'selectionLayer').set({});
		// viewportDimensions.set(newSize);
	},
	refreshEditor: function() { //tnrtodo: hacky hack until baobab is fixed completely... this causes the editor to update itself..
		var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
		this.setSelectionLayer(selectionLayer);
	},
	moveCaret: function(numberToMove) {
		var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
		var sequenceLength = tree.facets.sequenceLength.get();
		var caretPosition = tree.select('vectorEditorState', 'caretPosition').get();
		if (selectionLayer.selected) {
			if (numberToMove > 0) {
				tree.select('vectorEditorState', 'caretPosition').set(selectionLayer.end + 1);
			} else {
				tree.select('vectorEditorState', 'caretPosition').set(selectionLayer.start);
			}
			this.setSelectionLayer(false);
		} else {
			caretPosition += numberToMove;
			caretPosition = trimNumberToFitWithin0ToAnotherNumber(caretPosition, sequenceLength);
			tree.select('vectorEditorState', 'caretPosition').set(caretPosition);
		}
	},
	moveCaretShiftHeld: function(numberToMove) {
		console.log('hey: ');
		var selectionLayer = _.assign({},tree.select('vectorEditorState', 'selectionLayer').get());

		var sequenceLength = tree.facets.sequenceLength.get();
		var caretPosition = JSON.parse(JSON.stringify(tree.select('vectorEditorState', 'caretPosition').get())); //tnrtodo: this json stringify stuff is probably unneeded
		if (selectionLayer.selected) {
			if (selectionLayer.cursorAtEnd) {
				selectionLayer.end += numberToMove;
				selectionLayer.end = trimNumberToFitWithin0ToAnotherNumber(selectionLayer.end, sequenceLength - 1);
			} else {
				selectionLayer.start += numberToMove;
				selectionLayer.start = trimNumberToFitWithin0ToAnotherNumber(selectionLayer.start, sequenceLength - 1);
			}
			this.setSelectionLayer(selectionLayer);
		} else {
			if (numberToMove > 0) {
				this.setSelectionLayer({
					start: caretPosition,
					end: trimNumberToFitWithin0ToAnotherNumber(caretPosition + numberToMove - 1, sequenceLength - 1),
					cursorAtEnd: true
				});
			} else {
				this.setSelectionLayer({
					start: trimNumberToFitWithin0ToAnotherNumber(caretPosition + numberToMove + 1, sequenceLength - 1),
					end: caretPosition,
					cursorAtEnd: false
				});
			}
			caretPosition += numberToMove;
			if (caretPosition < 0) {
				caretPosition = 0;
			}
			if (caretPosition > sequenceLength) {
				caretPosition = sequenceLength;
			}
			tree.select('vectorEditorState', 'caretPosition').set(caretPosition);
		}
	},
	moveCaretLeftOne: function() {
		this.moveCaret(-1);
	},
	moveCaretRightOne: function() {
		this.moveCaret(1);
	},
	moveCaretUpARow: function() {
		var bpsPerRow = tree.facets.bpsPerRow.get();
		this.moveCaret(-bpsPerRow);
	},
	moveCaretDownARow: function() {
		var bpsPerRow = tree.facets.bpsPerRow.get();
		this.moveCaret(bpsPerRow);
	},
	moveCaretLeftOneShiftHeld: function() {
		this.moveCaretShiftHeld(-1);
	},
	moveCaretRightOneShiftHeld: function() {
		this.moveCaretShiftHeld(1);
	},
	moveCaretUpARowShiftHeld: function() {
		var bpsPerRow = tree.facets.bpsPerRow.get();
		this.moveCaretShiftHeld(-bpsPerRow);
	},
	moveCaretDownARowShiftHeld: function() {
		var bpsPerRow = tree.facets.bpsPerRow.get();
		this.moveCaretShiftHeld(bpsPerRow);
	},
	// keyPressedInEditor: function(event) {
	// 	event.preventDefault();
	// 	if (event) {
	// 	}
	// 	// tree.select('vectorEditorState', 'selectionLayer').set({});
	// 	// viewportDimensions.set(newSize);
	// },
};

module.exports = actions;