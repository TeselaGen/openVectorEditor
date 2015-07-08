var tree = require('../baobabTree');
var assign = require('lodash/object/assign');
var ObjectID = require("bson-objectid");
var isInteger = require("is-integer");
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
// var splice = require("underscore.string/splice");
var getOverlapsOfPotentiallyCircularRanges = require('../getOverlapsOfPotentiallyCircularRanges');
var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('../collapseOverlapsGeneratedFromRangeComparisonIfPossible');
var adjustRangeToDeletionOfAnotherRange = require('../adjustRangeToDeletionOfAnotherRange');
var trimNumberToFitWithin0ToAnotherNumber = require('../trimNumberToFitWithin0ToAnotherNumber');
var adjustRangeToSequenceInsert = require('../adjustRangeToSequenceInsert');
var spliceString = require('string-splice');
var getSubstringByRange = require('get-substring-by-range');
var areRangesValid = require('../areRangesValid');
var filterSequenceString = require('../filterSequenceString');
var validateAndTidyUpSequenceData = require('../validateAndTidyUpSequenceData');

var actions = {
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
			};
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
			var totalRows = tree.facets.totalRows.get();
			if (newVisibleRows.end > totalRows - 1) {
				newVisibleRows = {
					start: newVisibleRows.start - (newVisibleRows.end - totalRows - 1),
					end: totalRows - 1
				}
			}
			var previousVisibleRows = tree.select('vectorEditorState', 'visibleRows').get();
			if (previousVisibleRows.start !== newVisibleRows.start || previousVisibleRows.end !== newVisibleRows.end) {
				tree.select('vectorEditorState', 'visibleRows').set(newVisibleRows);
				tree.commit();
			}
		} else {
			throw ("visibleRows object is missing or invalid");
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
				if (rangeToDelete.start > rangeToDelete.end) {
					this.setCaretPosition(rangeToDelete.start - rangeToDelete.end - 1);
				} else {
					this.setCaretPosition(rangeToDelete.start);
				}
			}
		} else if (tree.select('vectorEditorState', 'caretPosition').get()) {
			//update the cursor position
			if (rangeToDelete.start > rangeToDelete.end) {
				this.setCaretPosition(rangeToDelete.start - rangeToDelete.end - 1);
			} else {
				this.setCaretPosition(rangeToDelete.start);
			}
			// this.setCaretPosition(tree.select('vectorEditorState', 'caretPosition').get() - rangeToDelete.start);
		} else {
			throw 'must have a selection layer or a caretPosition';
			// console.warn('must have a selection layer or a caretPosition');
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
			newSequenceData.features = sequenceData.features.map(function(annotation) {
				var newAnnotationRange = adjustRangeToDeletionOfAnotherRange(annotation, rangeToDelete, sequenceLength);
				if (newAnnotationRange) {
					var adjustedAnnotation = assign({}, annotation);
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
			newSequenceData.parts = sequenceData.parts.map(function(annotation) {
				var newAnnotationRange = adjustRangeToDeletionOfAnotherRange(annotation, rangeToDelete);
				if (newAnnotationRange) {
					var adjustedAnnotation = assign({}, annotation);
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
		this.insertSequenceData({sequence: sequenceString});
	},

	insertSequenceData: function(sequenceDataToInsert) {
		if (!sequenceDataToInsert || !sequenceDataToInsert.sequence.length) {
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
			//tnr: need to handle the splitting up of a sequence
			var newSequenceData = assign({},sequenceData,insertSequenceDataAtPosition(sequenceDataToInsert, sequenceData, caretPosition));
			// console.log('sequenceData.sequence.length: ' + sequenceData.sequence.length);
			// console.log('newSequenceData.sequence.length: ' + newSequenceData.sequence.length);
			tree.select('vectorEditorState', 'sequenceData').set(newSequenceData);
			console.log('newdata set');
			//update the caret position to be at the end of the newly inserted sequence
			this.setCaretPosition(sequenceDataToInsert.sequence.length + caretPosition);
		} else {
			console.warn('nowhere to put the inserted sequence..');
			return;
		}
		this.refreshEditor(); //tnrtodo: hacky hack until baobab is fixed completely... this causes the editor to update itself..
		//insert the sequence
		// tree.select('vectorEditorState', 'selectionLayer').set({});
		// viewportDimensions.set(newSize);
		function insertSequenceDataAtPosition(sequenceDataToInsert, existingSequenceData, caretPosition) {
			sequenceDataToInsert = validateAndTidyUpSequenceData(sequenceDataToInsert);
			existingSequenceData = validateAndTidyUpSequenceData(existingSequenceData);
			var newSequenceData = validateAndTidyUpSequenceData({}); //makes a new blank sequence

			var insertLength = sequenceDataToInsert.sequence.length;
			//splice the underlying sequence
			newSequenceData.sequence = spliceString(existingSequenceData.sequence, caretPosition, 0, sequenceDataToInsert.sequence);
			newSequenceData.features = newSequenceData.features.concat(adjustAnnotationsToInsert(existingSequenceData.features, caretPosition, insertLength));
			newSequenceData.parts = newSequenceData.parts.concat(adjustAnnotationsToInsert(existingSequenceData.parts, caretPosition, insertLength));
			newSequenceData.features = newSequenceData.features.concat(adjustAnnotationsToInsert(sequenceDataToInsert.features, 0, caretPosition));
			newSequenceData.parts = newSequenceData.parts.concat(adjustAnnotationsToInsert(sequenceDataToInsert.parts, 0, caretPosition));
			return newSequenceData;
		}

		function adjustAnnotationsToInsert(annotationsToBeAdjusted, insertStart, insertLength) {
			if (!annotationsToBeAdjusted) {
				throw 'no annotations passed!';
			}
			return annotationsToBeAdjusted.map(function(annotation) {
				var newAnnotationRange = adjustRangeToSequenceInsert(annotation, insertStart, insertLength);
				if (newAnnotationRange) {
					var adjustedAnnotation = assign({}, annotation);
					adjustedAnnotation.start = newAnnotationRange.start;
					adjustedAnnotation.end = newAnnotationRange.end;
					return adjustedAnnotation;
				} else {
					throw 'no range!';
				}
			});
		}
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
		var selectionLayer = assign({}, tree.select('vectorEditorState', 'selectionLayer').get());

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
	backspacePressed: function() {
		var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
		var caretPosition = tree.select('vectorEditorState', 'caretPosition').get();
		if (selectionLayer.selected) {
			this.deleteSequence(selectionLayer);
		} else {
			if (areNonNegativeIntegers([caretPosition])) {
				this.deleteSequence({
					start: caretPosition - 1,
					end: caretPosition - 1
				});
			} else {
				throw 'no caret or selection layer to delete!';
			}
		}
	},
	copySelection: function() {
		var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
		var sequenceData = tree.select('vectorEditorState', 'sequenceData').get();
		var clipboardDataCursor = tree.select('vectorEditorState', 'clipboardData');
		var allowPartialAnnotationsOnCopy = tree.select('vectorEditorState', 'allowPartialAnnotationsOnCopy').get();
		if (!clipboardDataCursor) {
			throw 'no clipboard cursor..';
		}
		if (sequenceData && selectionLayer.selected) {
			clipboardDataCursor.set(copyRangeOfSequenceData(sequenceData, selectionLayer, allowPartialAnnotationsOnCopy));

			function copyRangeOfSequenceData(sequenceData, rangeToCopy, allowPartialAnnotationsOnCopy) {
				if (sequenceData.sequence !== '' && !sequenceData.sequence) {
					throw 'invalid sequence data';
				}
				var sequenceLength = sequenceData.sequence.length;
				if (!areRangesValid([rangeToCopy], sequenceLength)) {
					throw 'invalid range passed';
				}
				var newSequenceData = {};
				newSequenceData.sequence = getSubstringByRange(sequenceData.sequence, rangeToCopy);
				newSequenceData.features = copyAnnotationsByRange(sequenceData.features, rangeToCopy, sequenceLength);
				newSequenceData.parts = copyAnnotationsByRange(sequenceData.parts, rangeToCopy, sequenceLength);

				function copyAnnotationsByRange(annotations, rangeToCopy, sequenceLength) {
					var copiedAnnotations = [];
					annotations.forEach(function(annotation) {
						var overlaps = getOverlapsOfPotentiallyCircularRanges(annotation, rangeToCopy, sequenceLength);
						var collapsedOverlaps = collapseOverlapsGeneratedFromRangeComparisonIfPossible(overlaps, sequenceLength);
						if (!allowPartialAnnotationsOnCopy) {
							//filter out any annotations that aren't whole
							collapsedOverlaps = collapsedOverlaps.filter(function(overlap) {
								return (overlap.start === annotation.start && overlap.end === annotation.end);
							});
						}
						if (collapsedOverlaps.length > 1) {
							//tnrtodo: add a new bson id for the 2nd annotation!
							console.log('splitting annotation on copy!');
						}
						collapsedOverlaps.forEach(function(collapsedOverlap) {
							//shift the collapsedOverlaps by the rangeToCopy start if necessary
							var collapsedAndShiftedOverlap = shiftCopiedOverlapByRange(collapsedOverlap, rangeToCopy, sequenceLength);
							copiedAnnotations.push(assign({}, annotation, collapsedAndShiftedOverlap));
						});
					});
					return copiedAnnotations;
				}
				return assign({}, sequenceData, newSequenceData); //merge any other properties that exist in sequenceData into newSequenceData
			}
			function shiftCopiedOverlapByRange (copiedOverlap, rangeToCopy, sequenceLength) {
				var end = copiedOverlap.end - rangeToCopy.start;
				if (end < 0) {
					end += sequenceLength - 1;
				}
				var start = copiedOverlap.start - rangeToCopy.start;
				if (start < 0) {
					start += sequenceLength - 1;
				}
				return {
					start: start,
					end: end
				};
			}
		}
	},

	pasteSequenceString: function(sequenceString) {
		//compare the sequenceString being pasted in with what's already stored in the clipboard
		var clipboardData = tree.select('vectorEditorState', 'clipboardData').get();
		if (clipboardData && clipboardData.sequence && clipboardData.sequence === sequenceString) {
			// insert clipboardData
			//assign clipboardData annotations new ids
			var clipboardDataWithNewIds = generateNewIdsForSequenceAnnotations(clipboardData);
			this.insertSequenceData(clipboardDataWithNewIds);
		} else {
			//clean up the sequence string and insert it
			this.insertSequenceString(filterSequenceString(sequenceString));
		}
		function generateNewIdsForSequenceAnnotations(sequenceData) {
			return assign({}, sequenceData, {
				features: generateNewIdsForAnnotations(sequenceData.features),
				parts: generateNewIdsForAnnotations(sequenceData.parts)
			});
		}
		function generateNewIdsForAnnotations(annotations) {
			return annotations.map(function (annotation) {
				return assign({},annotation, {id:ObjectID().str});
			});
		}
	},
	selectAll: function() {
		//compare the sequenceString being pasted in with what's already stored in the clipboard
		var sequenceLength = tree.facets.sequenceLength.get();
		this.setSelectionLayer({
			start: 0,
			end: sequenceLength - 1
		});
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
