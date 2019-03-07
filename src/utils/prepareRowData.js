import { mapAnnotationsToRows } from "ve-sequence-utils";
import { annotationTypes } from "ve-sequence-utils";
export default function prepareRowData(sequenceData, bpsPerRow) {
  let sequenceLength = sequenceData.noSequence
    ? sequenceData.size
    : sequenceData.sequence.length;
  let totalRows = Math.ceil(sequenceLength / bpsPerRow) || 1; //this check makes sure there is always at least 1 row!
  let rows = [];
  let rowMap = {};
  if (sequenceData.isProtein) {
    rowMap.primaryProteinSequence = mapAnnotationsToRows(
      [
        {
          id: "primaryProteinSequence",
          forward: true,
          start: 0,
          end: sequenceLength - 1,
          proteinSequence: sequenceData.proteinSequence,
          aminoAcids: sequenceData.aminoAcidDataForEachBaseOfDNA
        }
      ],
      sequenceLength,
      bpsPerRow
    );
  }
  annotationTypes.forEach(function(type) {
    rowMap[type] = mapAnnotationsToRows(
      sequenceData[type],
      sequenceLength,
      bpsPerRow
    );
  });

  for (let rowNumber = 0; rowNumber < totalRows; rowNumber++) {
    const row = {};
    row.rowNumber = rowNumber;
    row.start = rowNumber * bpsPerRow;
    row.end =
      (rowNumber + 1) * bpsPerRow - 1 < sequenceLength
        ? (rowNumber + 1) * bpsPerRow - 1
        : sequenceLength - 1;
    if (row.end < 0) {
      row.end = 0;
    }
    annotationTypes.forEach(function(type) {
      row[type] = rowMap[type][rowNumber] || [];
    });
    if (sequenceData.isProtein) {
      row.isProtein = true;
      row.primaryProteinSequence =
        rowMap.primaryProteinSequence &&
        (rowMap.primaryProteinSequence[rowNumber] || []);
    }
    row.sequence = sequenceData.noSequence
      ? {
          length: row.end + 1 - row.start
        }
      : sequenceData.sequence.slice(row.start, row.end + 1);

    rows[rowNumber] = row;
  }
  return rows;
}
