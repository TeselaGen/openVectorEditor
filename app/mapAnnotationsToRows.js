var ac = require('ve-api-check');
// ac.throw([ac.string,ac.bool],arguments);
var each = require('lodash/collection/each');
var sortBy = require('lodash/collection/sortBy');
var uniq = require('lodash/array/uniq');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var checkIfNonCircularRangesOverlap = require('ve-range-utils/checkIfNonCircularRangesOverlap');

module.exports = function mapAnnotationsToRows(annotations, sequenceLength, bpsPerRow) {
    ac.throw([ac.array, ac.posInt,ac.posInt],arguments);
    var annotationsToRowsMap = {};

    each(annotations, function(annotation) {
        if (!annotation) {
            throw new Error('no annotation!');
        }
        mapAnnotationToRows(annotation, sequenceLength, bpsPerRow, annotationsToRowsMap);
    });
    return annotationsToRowsMap;
};

function mapAnnotationToRows(annotation, sequenceLength, bpsPerRow, annotationsToRowsMap) {
    ac.throw([ac.range, ac.posInt, ac.posInt, ac.object], arguments);
    var ranges = splitRangeOnOrigin(annotation, sequenceLength);
    ranges.forEach(function(range) {
    // if (!isPositiveInteger(range.start)) {}
        var startingRow = Math.floor(range.start / bpsPerRow);
        var endingRow = Math.floor(range.end / bpsPerRow);
    // var numberOfRows = endingRow - startingRow + 1;
        for (var rowNumber = startingRow; rowNumber <= endingRow; rowNumber++) {
            if (!annotationsToRowsMap[rowNumber]) {
                annotationsToRowsMap[rowNumber] = [];
            }

            var start = rowNumber === startingRow ? range.start : rowNumber * bpsPerRow;
            var end = rowNumber === endingRow ? range.end : rowNumber * bpsPerRow + bpsPerRow - 1;

            var yOffset = calculateNecessaryYOffsetForAnnotationInRow(annotationsToRowsMap[rowNumber], {
                start: start,
                end: end,
                id: annotation.id,
            });

            annotationsToRowsMap[rowNumber].push({
                id: annotation.id,
                annotation: annotation,
                start: start,
                end: end,
                yOffset: yOffset,
                enclosingRangeType: range.type, //either "beginning", "end" or "beginningAndEnd"
            });
        }
    });
  // return annotationsToRowsMap;
}

// 
function calculateNecessaryYOffsetForAnnotationInRow(annotationsAlreadyAddedToRow, range) {
    var blockedYOffsets = [];
  //adjust the yOffset of the range being pushed in by checking its range against other ranges already in the row
    each(annotationsAlreadyAddedToRow, function(comparisonRange) {
    // don't push a blocked yOffset if the annotation id is the same as the annotation id of the range being added  
    //tnr: the above scenario should never happen...so we don't need to catch this
    // if (comparisonRange.id === range.id) {
    //   //do nothing
      
    // }
    //check for overlap with other annotations
        if (checkIfNonCircularRangesOverlap(range, comparisonRange)) {
            blockedYOffsets.push(comparisonRange.yOffset);
        }
    // }
    });

    var newYOffset = 0;
  //sort and remove duplicates from the blockedYOffsets array
  //then starting with newYOffset = 1, see if there is space for the location 
    if (blockedYOffsets.length > 0) {
        var sortedBlockedYOffsets = sortBy(blockedYOffsets, function(n) {
            return n;
        });
        var sortedUniqueBlockedYOffsets = uniq(sortedBlockedYOffsets, true); //true here specifies that the array has already been sorted
        var stillPotentiallyBlocked = true;
        while (stillPotentiallyBlocked) {
      //sortedUniqueBlockedYOffsets is an array starting with 1 eg. [1,2,4,5,6]
      //so we loop through it using the index of newYOffset-1, and if there is a gap 
      //in the array, we break the loop and that becomes our final newYOffset
            if (sortedUniqueBlockedYOffsets[newYOffset] !== newYOffset) {
        //the newYOffset isn't blocked
                stillPotentiallyBlocked = false;
            } else {
        //it is blocked
                newYOffset++;
            }
        }
    }
    return newYOffset;
}


function splitRangeOnOrigin(range, sequenceLength) {
    if (!areNonNegativeIntegers([range.start, range.end, sequenceLength])) {
        throw new Error('invalid inputs!')
    }
    var ranges = [];
    if (range.start > range.end) {
        ranges.push({
            start: 0,
            end: range.end,
            type: "end",
        });
        ranges.push({
            start: range.start,
            end: sequenceLength - 1,
            type: "beginning",
        });
    } else {
        ranges.push({
            start: range.start,
            end: range.end,
            type: "beginningAndEnd",
        });
    }
    return ranges;
}