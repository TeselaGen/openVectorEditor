var mapAnnotationsToRows = require('ve-sequence-utils/mapAnnotationsToRows');
var annotationTypes = require('ve-sequence-utils/annotationTypes');

module.exports = function prepareRowData(sequenceData, bpsPerRow, sequenceLength) {
    var totalRows = Math.ceil(sequenceLength / bpsPerRow) || 1; //this check makes sure there is always at least 1 row!
    var rows = [];
    var rowMap = {};
    annotationTypes.forEach(function (type) {
        rowMap[type] = mapAnnotationsToRows(sequenceData[type], sequenceLength, bpsPerRow)
    })

    console.log("sequence: " + {sequenceData})
    console.log("bps: " + bpsPerRow)
    console.log("length: " + sequenceLength)

    for (var rowNumber = 0; rowNumber < totalRows; rowNumber++) {
        var row = {};
        row.rowNumber = rowNumber;
        row.start = rowNumber * bpsPerRow;
        row.end = (rowNumber + 1) * (bpsPerRow) - 1 < sequenceLength ? (rowNumber + 1) * (bpsPerRow) - 1 : sequenceLength - 1;
        if (row.end < 0) {
            row.end = 0
        }
        annotationTypes.forEach(function (type) {
            row[type] = rowMap[type][rowNumber] || []
        })
        row.sequence = sequenceData.sequence.slice(row.start, (row.end + 1));
        
        rows[rowNumber] = row;
    }
    return rows;
}