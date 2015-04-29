var _ = require('lodash');

function prepareRowData(sequenceData, preloadRowStart, preloadRowEnd, rowLength, alreadyPreparedRows) {
  var sequenceLength = sequenceData.sequence.length;
  // var totalRows = Math.ceil(sequenceLength/visibilityParameters.rowLength);
  if (!alreadyPreparedRows) {
    var alreadyPreparedRows = {};
  }
  var requestedRows = [];
  for (var rowNumber = preloadRowStart; rowNumber < preloadRowEnd + 1; rowNumber++) {
    if (!alreadyPreparedRows[rowNumber]) {
      alreadyPreparedRows[rowNumber] = populateRowByRowNumber(sequenceData, rowLength, rowNumber, sequenceLength);
    }
    requestedRows.push(alreadyPreparedRows[rowNumber]);
  }
  //return only the requested rows
  return requestedRows;
}

function populateRowByRowNumber(sequenceData, rowLength, rowNumber, sequenceLength) {
  var row = {};
  row.rowNumber = rowNumber;
  row.start = rowNumber * rowLength;
  row.end = (rowNumber + 1) * (rowLength) - 1;
  row.sequence = sequenceData.sequence.slice(row.start, (row.end + 1));

  // console.log('row.rowNumber');
  // console.log(row.rowNumber);
  // console.log('row.start');
  // console.log(row.start);
  // console.log('row.end');
  // console.log(row.end);
  // console.log('row.sequence');
  // console.log(row.sequence);

  var {
    annotations, annotationYOffsetMax
  } = mapAnnotationsToRow(sequenceData.features, row, sequenceLength);
  row.features = annotations;
  row.featuresYOffsetMax = annotationYOffsetMax;

  var {
    annotations, annotationYOffsetMax
  } = mapAnnotationsToRow(sequenceData.parts, row, sequenceLength);
  row.parts = annotations;
  row.partsYOffsetMax = annotationYOffsetMax;

  // row.parts = mapAnnotationsToRow(sequenceData.parts, row, sequenceLength);
  // row.orfs = mapAnnotationsToRow(sequenceData.orfs, row, sequenceLength);
  // row.cutsites = mapAnnotationsToRow(sequenceData.cutsites, row, sequenceLength);

  return row;
}

function mapAnnotationsToRow(annotations, row, sequenceLength) {
  var annotationsInRow = {};
  var annotationYOffsetMax = 0; //
  //convert each anotation into 1 or 2 annotationLocations by spliiting on the origin.
  //for each location, add to the row any stetches of the location that overlap the row

  _.each(annotations, function(annotation) {
    var annotationLocations = splitAnnotationOnOrigin(annotation, sequenceLength);
    var overlaps;
    annotationLocations.forEach(function(annotationLocation) {
      var overlap = getOverlapOfRowWithAnnotationLocation(annotationLocation, annotation, row);
      if (overlap) { //only if the annotationLocation overlaps with the row do we push anything in
        if (!overlaps) {
          overlaps = [];
        }
        overlaps.push(overlap);
      }
    });
    if (overlaps) {
      //calculate the yOffset for the new overlaps
      var yOffset = calculateNecessaryYOffsetForAnnotationInRow(annotationsInRow, overlaps);
      if (yOffset > annotationYOffsetMax) {
        annotationYOffsetMax = yOffset;
      }
      //add the annotation to the row
      var annotationId = annotation.id;
      annotationsInRow[annotationId] = {
        annotation: annotation,
        overlaps: overlaps,
        yOffset: yOffset
      };
    }
  }, this);
  return {
    annotations: annotationsInRow,
    annotationYOffsetMax: annotationYOffsetMax
  };
}

function calculateNecessaryYOffsetForAnnotationInRow(annotationsAlreadyAddedToRow, overlaps) {
  var blockedYOffsets = [];
  //adjust the yOffset of the location being pushed in by checking its range against other locations in the row
  _.each(annotationsAlreadyAddedToRow, function(comparisonAnnotation) {
    //loop through every location in the comparisonAnnotation (there is a max of two)
    //also note that locations cannot be circular
    comparisonAnnotation.overlaps.forEach(function(comparisonOverlap) {
      overlaps.forEach(function(overlap) {
        //check for overlap with other annotations
        if (overlap.start < comparisonOverlap.start) {
          if (overlap.end < comparisonOverlap.start) {
            //----llll
            //--------cccc
            //no overlap
          } else {
            //----llll
            //-------cccc
            //overlap
            blockedYOffsets.push(comparisonAnnotation.yOffset);
          }
        } else {
          if (overlap.start > comparisonOverlap.end) {
            //------llll
            // -cccc
            //no overlap
          } else {
            //-----llll
            // -cccc
            //overlap
            blockedYOffsets.push(comparisonAnnotation.yOffset);
          }
        }
      });

    });
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

function splitAnnotationOnOrigin(annotation, sequenceLength) {
  var annotationLocations = [];
  if (annotation.start > annotation.end) {
    annotationLocations.push({
      start: 0,
      end: annotation.end
    });
    annotationLocations.push({
      start: annotation.start,
      end: sequenceLength - 1
    });
  } else {
    annotationLocations.push({
      start: annotation.start,
      end: annotation.end
    });
  }
  return annotationLocations;
}

function getOverlapOfRowWithAnnotationLocation(annotationLocation, annotation, row) {
  var overlap;
  if (annotationLocation.start < row.start) {
    if (annotationLocation.end < row.start) {
      //do nothing
    } else { //end of annotation intersects row
      if (annotationLocation.end < row.end) {
        overlap = {
          start: row.start,
          end: annotationLocation.end
        };
      } else {
        overlap = {
          start: row.start,
          end: row.end
        };
      }
    }
  } else { //annotationLocation.start >= row.start
    if (annotationLocation.start > row.end) {
      //do nothing
    } else { //annotationLocation.start <= row.end
      //start of annotation intersects row
      if (annotationLocation.end < row.end) {
        //annotation fully enclosed within row
        overlap = {
          start: annotationLocation.start,
          end: annotationLocation.end
        };
      } else {
        //annotation end greater than row end
        overlap = {
          start: annotationLocation.start,
          end: row.end
        };
      }
    }
  }
  if (overlap) {
    //get the overlap type
    if (overlap.start === annotation.start) {
      if (overlap.end === annotation.end) {
        overlap.type = "beginningAndEnd";
      } else {
        overlap.type = "beginning";
      }
    } else {
      if (overlap.end === annotation.end) {
        overlap.type = "end";
      } else {
        overlap.type = "middle";
      }
    }
    return overlap;
  }
}

module.exports = prepareRowData;