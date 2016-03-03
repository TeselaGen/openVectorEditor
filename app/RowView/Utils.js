export default {
    columnizeString: function(string, columnWidth) {
        var columnizedString = '';

        if (columnWidth) {

            for (let i = 0; i < string.length; i += columnWidth) {
                columnizedString += string.substr(i, columnWidth) + ' ';
            }
        }

        return columnizedString;
    }
}
