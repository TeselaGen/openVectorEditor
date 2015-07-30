var _ = require('lodash');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

function prepareRowData(sequenceData, bpsPerRow) {
  var sequenceLength = sequenceData.sequence.length;
  var totalRows = Math.ceil(sequenceLength / bpsPerRow) || 1; //this check makes sure there is always at least 1 row!
  var rows = [];
  var featuresToRowsMap = mapAnnotationsToRows(sequenceData.features, sequenceLength, bpsPerRow);
  var partsToRowsMap = mapAnnotationsToRows(sequenceData.parts, sequenceLength, bpsPerRow);
  var orfsToRowsMap = mapAnnotationsToRows(sequenceData.orfs, sequenceLength, bpsPerRow);

  for (var rowNumber = 0; rowNumber < totalRows; rowNumber++) {
    var row = {};
    row.rowNumber = rowNumber;
    row.start = rowNumber * bpsPerRow;
    row.end = (rowNumber + 1) * (bpsPerRow) - 1 < sequenceLength ? (rowNumber + 1) * (bpsPerRow) - 1 : sequenceLength-1;
    row.sequence = sequenceData.sequence.slice(row.start, (row.end + 1));
    row.features = featuresToRowsMap[rowNumber] ? featuresToRowsMap[rowNumber] : [];
    row.parts = partsToRowsMap[rowNumber] ? partsToRowsMap[rowNumber] : [];
    row.orfs = orfsToRowsMap[rowNumber] ? orfsToRowsMap[rowNumber] : [];
    // row.cutsites = cutsitesToRowsMap[rowNumber];
    rows[rowNumber] = row;
  }
  return rows;
}




function mapAnnotationsToRows(annotations, sequenceLength, bpsPerRow) {
  var annotationsToRowsMap = {};
  if (!annotations) {
    console.warn("no annotations detected")
  }

  _.each(annotations, function(annotation) {
    if (!annotation) {
      throw 'no annotation!'
    }
    mapAnnotationToRows(annotation, sequenceLength, bpsPerRow, annotationsToRowsMap);
  });
  return annotationsToRowsMap;

}

function mapAnnotationToRows(annotation, sequenceLength, bpsPerRow, annotationsToRowsMap) {
  if (!annotationsToRowsMap) {
    console.warn("annotationsToRowsMap must be defined");
    return {};
  }
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
      // var start;
      // var end;
      // var type;
      //this logic should maybe be moved to the rendering of the features, parts, whatever..
      //probably makes more sense to do it there because cutsites and other things aren't going to be concerned with
      //the "type" of range.. so we shouldn't do it here where all annotation will have to perform calcs..
      //could be done 
      // if (rowNumber === startingRow ) {
      //   start = range.start;
      //   if (rowNumber === endingRow) { 
      //     // annotation begins and ends on this row
      //     end = range.end;
      //     type = range.type;
      //   } else {
      //     // annotation begins but doesn't end on this row
      //     end = rowNumber * bpsPerRow + bpsPerRow - 1;
      //     type = range.type === "end" ? "middle" : "beginning"; //if the range.type is an "end", the type can't be a beginning
      //   }
      // } else {
      //   start = rowNumber * bpsPerRow;
      //   if (rowNumber === endingRow) {
      //     end = range.end;

      //   } else {
      //     end = rowNumber * bpsPerRow + bpsPerRow - 1;
      //     type = "middle";
      //   }
      // }

      // if (rowNumber === startingRow) {
      //   start = range.start;
      // } else {
      //   start = rowNumber * bpsPerRow;
      // }
      // if (rowNumber === endingRow) {
      //   end = range.end;
      // } else {
      //   end = rowNumber * bpsPerRow + bpsPerRow - 1;
      // }
      // var end = rowNumber === endingRow ? range.end : rowNumber * bpsPerRow + bpsPerRow - 1;

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
        rangeType: range.type, //either "beginning", "end" or "beginningAndEnd"
      });
    }
  });
  // return annotationsToRowsMap;
}

// 

function calculateNecessaryYOffsetForAnnotationInRow(annotationsAlreadyAddedToRow, range) {
  var blockedYOffsets = [];
  //adjust the yOffset of the range being pushed in by checking its range against other ranges already in the row
  _.each(annotationsAlreadyAddedToRow, function(comparisonRange) {

    // don't push a blocked yOffset if the annotation id is the same as the annotation id of the range being added  
    if (comparisonRange.id === range.id) {
      //do nothing
    } else {
      //check for overlap with other annotations
      //tnrtodo, abstract out the range comparison check to a helper function
      if (range.start < comparisonRange.start) {
        if (range.end < comparisonRange.start) {
          //----llll
          //--------cccc
          //no overlap
        } else {
          //----llll
          //-------cccc
          //overlap
          blockedYOffsets.push(comparisonRange.yOffset);
        }
      } else {
        if (range.start > comparisonRange.end) {
          //------llll
          // -cccc
          //no overlap
        } else {
          //-----llll
          // -cccc
          //overlap
          blockedYOffsets.push(comparisonRange.yOffset);
        }
      }
    }
  });

  var newYOffset = 1;
  //sort and remove duplicates from the blockedYOffsets array
  //then starting with newYOffset = 1, see if there is space for the location 
  if (blockedYOffsets.length > 0) {
    var sortedBlockedYOffsets = _.sortBy(blockedYOffsets, function(n) {
      return n;
    });
    var sortedUniqueBlockedYOffsets = _.uniq(sortedBlockedYOffsets, true); //true here specifies that the array has already been sorted
    var stillPotentiallyBlocked = true;
    while (stillPotentiallyBlocked) {
      //sortedUniqueBlockedYOffsets is an array starting with 1 eg. [1,2,4,5,6]
      //so we loop through it using the index of newYOffset-1, and if there is a gap 
      //in the array, we break the loop and that becomes our final newYOffset
      if (sortedUniqueBlockedYOffsets[newYOffset - 1] !== newYOffset) {
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
    throw ('invalid inputs!')
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

// function getOverlapOfRowWithAnnotationLocation(annotationLocation, annotation, row) {
//   var overlap;
//   if (annotationLocation.start < row.start) {
//     if (annotationLocation.end < row.start) {
//       //do nothing
//     } else { //end of annotation intersects row
//       if (annotationLocation.end < row.end) {
//         overlap = {
//           start: row.start,
//           end: annotationLocation.end
//         };
//       } else {
//         overlap = {
//           start: row.start,
//           end: row.end
//         };
//       }
//     }
//   } else { //annotationLocation.start >= row.start
//     if (annotationLocation.start > row.end) {
//       //do nothing
//     } else { //annotationLocation.start <= row.end
//       //start of annotation intersects row
//       if (annotationLocation.end < row.end) {
//         //annotation fully enclosed within row
//         overlap = {
//           start: annotationLocation.start,
//           end: annotationLocation.end
//         };
//       } else {
//         //annotation end greater than row end
//         overlap = {
//           start: annotationLocation.start,
//           end: row.end
//         };
//       }
//     }
//   }
//   if (overlap) {
//     //get the overlap type
//     if (overlap.start === annotation.start) {
//       if (overlap.end === annotation.end) {
//         overlap.type = "beginningAndEnd";
//       } else {
//         overlap.type = "beginning";
//       }
//     } else {
//       if (overlap.end === annotation.end) {
//         overlap.type = "end";
//       } else {
//         overlap.type = "middle";
//       }
//     }
//     return overlap;
//   }
// }

module.exports = prepareRowData;



// function mapAnnotationsToRow(annotations, row, sequenceLength) {
//   var annotationsInRow = {};
//   var annotationYOffsetMax = 0; //
//   //convert each anotation into 1 or 2 annotationLocations by spliiting on the origin.
//   //for each location, add to the row any stetches of the location that overlap the row

//   _.each(annotations, function(annotation) {
//     var annotationLocations = splitRangeOnOrigin(annotation, sequenceLength, sequenceLength);
//     var overlaps;
//     annotationLocations.forEach(function(annotationLocation) {
//       var overlap = getOverlapOfRowWithAnnotationLocation(annotationLocation, annotation, row);
//       if (overlap) { //only if the annotationLocation overlaps with the row do we push anything in
//         if (!overlaps) {
//           overlaps = [];
//         }
//         overlaps.push(overlap);
//       }
//     });
//     if (overlaps) {
//       //calculate the yOffset for the new overlaps
//       var yOffset = calculateNecessaryYOffsetForAnnotationInRow(annotationsInRow, overlaps);
//       if (yOffset > annotationYOffsetMax) {
//         annotationYOffsetMax = yOffset;
//       }
//       //add the annotation to the row
//       var annotationId = annotation.id;
//       annotationsInRow[annotationId] = {
//         annotation: annotation,
//         overlaps: overlaps,
//         yOffset: yOffset
//       };
//     }
//   }, this);
//   return {
//     annotations: annotationsInRow,
//     annotationYOffsetMax: annotationYOffsetMax
//   };
// }

// function splitAnnotationsOnOriginAndSortThem(annotations) {
//   var startBPMap = {};
//   var endBPMap = {};
//   annotations.forEach(function(annotation) {
//     annotationLocations = splitRangeOnOrigin(annotation, sequenceLength);
//     annotationLocations.forEach(function(location) {
//       if (!startBPMap[annotationLocation.start]) {
//         //initialize the array if there isn't one already
//         startBPMap[annotationLocation.start] = [];
//       }
//       //push the annotation into the array
//       startBPMap[annotationLocation.start].push(annotation.id);
//       if (!endBPMap[annotationLocation.end]) {
//         //initialize the array if there isn't one already
//         endBPMap[annotationLocation.end] = [];
//       }
//       //push the annotation into the array
//       endBPMap[annotationLocation.end].push(annotation.id);
//     });
//   });
// }

// //assumes the range doesn't not span the origin!
// function findAnnotationsThatFallWithinRangeBasedOnTheStartAndEndMaps(range, startBPMap, endBPMap) {
//   var possibleHitsBasedOnStartValue = {};
//   _.each(startBPMap, function(annotationIds, startBP) {
//     if (startBP < range.end) {
//       annotationIds.forEach(function(annotationId) {
//         if (!possibleHitsBasedOnStartValue[annotationId]) {
//           possibleHitsBasedOnStartValue[annotationId] = [];
//         }
//         possibleHitsBasedOnStartValue[annotationId].push(startBP);
//       });
//     }
//   });

//   var hitsBasedOnStartAndEndValues = {};
//   _.each(endBPMap, function(annotationIds, endBP) {
//     if (endBP > range.start) {
//       annotationIds.forEach(function(annotationId) {
//         if (possibleHitsBasedOnStartValue[annotationId]) {
//           if (!hitsBasedOnStartAndEndValues[annotationId]) {
//             hitsBasedOnStartAndEndValues[annotationId] = [];
//             possibleHitsBasedOnStartValue[annotationId].forEach(function(start) {
//               hitsBasedOnStartAndEndValues[annotationId].push(start);
//             });
//           }
//           hitsBasedOnStartAndEndValues[annotationId].push(endBP);
//           // hitsBasedOnStartAndEndValues[annotationId][0].end === null ? 
//         }
//       });
//     }
//   });

//   _each(hitsBasedOnStartAndEndValues, function(annotationIds, arrayOfHits) {
//     if (arrayOfHits.length === 2) {
//       //normal hit [start,end]
//       arrayOfHits = {
//         start: arrayOfHits[0] > range.start ? arrayOfHits[0] : range.start,
//         end: arrayOfHits[1] < range.end ? arrayOfHits[0] : range.end,
//       };
//     } else if (arrayOfHits.length === 3) {
//       //special case [start1,start2,end]
//       arrayOfHits = {
//         start: arrayOfHits[0] > arrayOfHits[1] ? arrayOfHits[0] : arrayOfHits[1],
//         end: arrayOfHits[2],
//       };
//     } else if (arrayOfHits.length === 4) {
//       //special case [start1,start2,end1,end2]
//       var start1;
//       var start2;
//       var end1;
//       var end2;
//       if (arrayOfHits[0] < arrayOfHits[1]) {
//         start1 = arrayOfHits[0];
//         start2 = arrayOfHits[1];
//       } else {
//         start1 = arrayOfHits[1];
//         start2 = arrayOfHits[0];
//       }
//       if (arrayOfHits[2] < arrayOfHits[3]) { //sub in ends!
//         end1 = arrayOfHits[2];
//         end2 = arrayOfHits[3];
//       } else {
//         end1 = arrayOfHits[1];
//         end2 = arrayOfHits[0];
//       }
//     }
//   });

// }

// function calculateNecessaryYOffsetForAnnotationInRow(annotationsAlreadyAddedToRow, overlaps) {
//   var blockedYOffsets = [];
//   //adjust the yOffset of the location being pushed in by checking its range against other locations in the row
//   _.each(annotationsAlreadyAddedToRow, function(comparisonAnnotation) {
//     //loop through every location in the comparisonAnnotation (there is a max of two)
//     //also note that locations cannot be circular
//     comparisonAnnotation.overlaps.forEach(function(comparisonOverlap) {
//       overlaps.forEach(function(overlap) {
//         //check for overlap with other annotations
//         if (overlap.start < comparisonOverlap.start) {
//           if (overlap.end < comparisonOverlap.start) {
//             //----llll
//             //--------cccc
//             //no overlap
//           } else {
//             //----llll
//             //-------cccc
//             //overlap
//             blockedYOffsets.push(comparisonAnnotation.yOffset);
//           }
//         } else {
//           if (overlap.start > comparisonOverlap.end) {
//             //------llll
//             // -cccc
//             //no overlap
//           } else {
//             //-----llll
//             // -cccc
//             //overlap
//             blockedYOffsets.push(comparisonAnnotation.yOffset);
//           }
//         }
//       });

//     });
//   });

//   var newYOffset = 1;
//   //sort and remove duplicates from the blockedYOffsets array
//   //then starting with newYOffset = 1, see if there is space for the location 
//   if (blockedYOffsets.length > 0) {
//     var sortedBlockedYOffsets = _.sortBy(blockedYOffsets, function(n) {
//       return n;
//     });
//     var sortedUniqueBlockedYOffsets = _.uniq(sortedBlockedYOffsets, true); //true here specifies that the array has already been sorted
//     var stillPotentiallyBlocked = true;
//     while (stillPotentiallyBlocked) {
//       //sortedUniqueBlockedYOffsets is an array starting with 1 eg. [1,2,4,5,6]
//       //so we loop through it using the index of newYOffset-1, and if there is a gap 
//       //in the array, we break the loop and that becomes our final newYOffset
//       if (sortedUniqueBlockedYOffsets[newYOffset - 1] !== newYOffset) {
//         //the newYOffset isn't blocked
//         stillPotentiallyBlocked = false;
//       } else {
//         //it is blocked
//         newYOffset++;
//       }
//     }
//   }
//   return newYOffset;
// }