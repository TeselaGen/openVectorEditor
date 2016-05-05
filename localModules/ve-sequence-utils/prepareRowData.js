var mapAnnotationsToRows = require('./mapAnnotationsToRows');
var annotationTypes = require('./annotationTypes');
//this function takes in the raw sequence data and spits out a representation of 
//the data for each row
module.exports = function prepareRowData(sequenceData, bpsPerRow) {
    // ac.throw([ac.sequenceData, ac.posInt], arguments);
    var sequenceLength = sequenceData.sequence.length;
    var totalRows = Math.ceil(sequenceLength / bpsPerRow) || 1; //this check makes sure there is always at least 1 row!
    var rows = [];
    var rowMaps = {}
    //map every annotation type to rows
    annotationTypes.forEach(function (annotationType) {
      rowMaps[annotationType] = mapAnnotationsToRows(sequenceData[annotationType], sequenceLength, bpsPerRow)
    })

    for (var rowNumber = 0; rowNumber < totalRows; rowNumber++) {
        var row = {};
        row.rowNumber = rowNumber;
        row.start = rowNumber * bpsPerRow;
        row.end = (rowNumber + 1) * (bpsPerRow) - 1 < sequenceLength ? (rowNumber + 1) * (bpsPerRow) - 1 : sequenceLength - 1;
        if (row.end < 0) {
            row.end = 0
        }
        row.sequence = sequenceData.sequence.slice(row.start, (row.end + 1));
        // add the annotations within the rowMaps to the actual row object
        annotationTypes.forEach(function (annotationType) {
          row[annotationType] = rowMaps[annotationType][rowNumber] || []
        })
        rows[rowNumber] = row;
    }
    return rows;
}
