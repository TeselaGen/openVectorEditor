export default {
    columnizeString: function(string, columnWidth) {
        var columns = [];

        if (columnWidth) {
            for (let i = 0; i < string.length; i += columnWidth) {
                columns.push(string.substr(i, columnWidth) + ' ');
            }
        }

        return columns.join('');
    }
}
