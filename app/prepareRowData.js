var ac = require('ve-api-check');
// ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
var mapAnnotationsToRows = require('./mapAnnotationsToRows');
module.exports = function prepareRowData(sequenceData, bpsPerRow) {
    ac.throw([ac.sequenceData, ac.posInt], arguments);
    var sequenceLength = sequenceData.sequence.length;
    var totalRows = Math.ceil(sequenceLength / bpsPerRow) || 1; //this check makes sure there is always at least 1 row!
    var rows = [];
    var featuresToRowsMap = mapAnnotationsToRows(sequenceData.features, sequenceLength, bpsPerRow);
    var partsToRowsMap = mapAnnotationsToRows(sequenceData.parts, sequenceLength, bpsPerRow);
    var orfsToRowsMap = mapAnnotationsToRows(sequenceData.orfs, sequenceLength, bpsPerRow);
    var translationsToRowsMap = mapAnnotationsToRows(sequenceData.translations, sequenceLength, bpsPerRow);
    var cutsitesToRowsMap = mapAnnotationsToRows(sequenceData.cutsites, sequenceLength, bpsPerRow);

    for (var rowNumber = 0; rowNumber < totalRows; rowNumber++) {
        var row = {};
        row.rowNumber = rowNumber;
        row.start = rowNumber * bpsPerRow;
        row.end = (rowNumber + 1) * (bpsPerRow) - 1 < sequenceLength ? (rowNumber + 1) * (bpsPerRow) - 1 : sequenceLength - 1;
        if (row.end < 0) {
            row.end = 0
        }
        row.sequence = sequenceData.sequence.slice(row.start, (row.end + 1));
        row.features = featuresToRowsMap[rowNumber] ? featuresToRowsMap[rowNumber] : [];
        row.parts = partsToRowsMap[rowNumber] ? partsToRowsMap[rowNumber] : [];
        row.orfs = orfsToRowsMap[rowNumber] ? orfsToRowsMap[rowNumber] : [];
        row.cutsites = cutsitesToRowsMap[rowNumber] ? cutsitesToRowsMap[rowNumber] : [];
        row.translations = translationsToRowsMap[rowNumber] ? translationsToRowsMap[rowNumber] : [];
        // row.cutsites = cutsitesToRowsMap[rowNumber];
        rows[rowNumber] = row;
    }
    return rows;
}