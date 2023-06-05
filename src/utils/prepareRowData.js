import { mapAnnotationsToRows } from "@teselagen/sequence-utils";
import { annotationTypes } from "@teselagen/sequence-utils";
export default function prepareRowData(sequenceData, bpsPerRow) {
  const sequenceLength = sequenceData.noSequence
    ? sequenceData.size
    : sequenceData.sequence.length;
  const totalRows = Math.ceil(sequenceLength / bpsPerRow) || 1; //this check makes sure there is always at least 1 row!
  const rows = [];
  const rowMap = {};
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
  annotationTypes.forEach(function (type) {
    rowMap[type] = mapAnnotationsToRows(
      sequenceData[type],
      sequenceLength,
      bpsPerRow,
      { splitForwardReverse: type === "primers" }
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
    annotationTypes.forEach(function (type) {
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
