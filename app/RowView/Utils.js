export default {
    columnizeString: function(string, columnWidth) {
        var columns = [];

        if (columnWidth) {
            for (let i = 0; i < string.length; i += columnWidth) {
                columns.push(string.substr(i, columnWidth) + ' ');
            }
        }

        return columns.join('');
    },

    calculateRowLength: function(charWidth, viewWidth, columnWidth) {
        if (!(charWidth && viewWidth)) return 0;

        var baseRowLength = Math.floor(viewWidth / charWidth);
        var adjustedRowLength = baseRowLength;

        if (columnWidth) {
            adjustedRowLength -= Math.floor(baseRowLength / columnWidth);
            adjustedRowLength = Math.floor(adjustedRowLength / columnWidth) * columnWidth;
        }

        return adjustedRowLength;
    },

    elementWidth: function(elem) {
        return (elem) ? parseFloat(getComputedStyle(elem).width) : 0;
    }
}
