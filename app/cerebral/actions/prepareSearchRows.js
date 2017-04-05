module.exports = function prepareSearchRows({ input, state, output }) {
    var sequenceLength = state.get('sequenceLength');
    var searchLayers = state.get('searchLayers');
    var bpsPerRow = state.get('bpsPerRow');

    var searchRows = {};
    var rows;

    searchLayers.forEach(function(result) {
        rows = [];
        var firstRow = Math.floor((result.start-1)/bpsPerRow);
        firstRow = firstRow < 0 ? 0 : firstRow;
        var lastRow = Math.floor(result.end/bpsPerRow);
        if (lastRow >= firstRow) {
            for (let i=firstRow; i<=lastRow; i++) {
                rows.push(i);
            }
        } else {
            for(let j=0; j<=lastRow; j++) {
                rows.push(j);
            }
            var endRow = Math.floor(sequenceLength/bpsPerRow);
            for (let k=firstRow; k<=endRow; k++) {
                rows.push(k);
            }
        }

        rows.forEach(function(row) {
            if (searchRows[row]) {
                searchRows[row].push(result);
            } else {
                searchRows[row] = [result];
            }
        });
    });
    console.log(searchRows);
    state.set('searchRows', searchRows);
}
