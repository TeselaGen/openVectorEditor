// var ac = require('ve-api-check');
// ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
import lruMemoize from "lru-memoize";

import mapAnnotationsToRows from "ve-sequence-utils/mapAnnotationsToRows";
import annotationTypes from "ve-sequence-utils/annotationTypes";
function prepareRowData(sequenceData, bpsPerRow) {
  // ac.throw([ac.sequenceData, ac.posInt], arguments);
  let sequenceLength = sequenceData.sequence.length;
  let totalRows = Math.ceil(sequenceLength / bpsPerRow) || 1; //this check makes sure there is always at least 1 row!
  let rows = [];
  let rowMap = {};
  annotationTypes.forEach(function(type) {
    rowMap[type] = mapAnnotationsToRows(
      sequenceData[type],
      sequenceLength,
      bpsPerRow
    );
  });

  for (var rowNumber = 0; rowNumber < totalRows; rowNumber++) {
    var row = {};
    row.rowNumber = rowNumber;
    row.start = rowNumber * bpsPerRow;
    row.end = (rowNumber + 1) * bpsPerRow - 1 < sequenceLength
      ? (rowNumber + 1) * bpsPerRow - 1
      : sequenceLength - 1;
    if (row.end < 0) {
      row.end = 0;
    }
    annotationTypes.forEach(function(type) {
      row[type] = rowMap[type][rowNumber] || [];
    });
    row.sequence = sequenceData.sequence.slice(row.start, row.end + 1);

    rows[rowNumber] = row;
  }
  return rows;
}

export default lruMemoize(5, undefined, true)(prepareRowData);
