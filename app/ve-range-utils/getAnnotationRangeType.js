module.exports = function getAnnotationRangeType(annotationRange, enclosingRangeType, forward) {
    if (annotationRange.start === enclosingRangeType.start) {
        if (annotationRange.end === enclosingRangeType.end) {
            return 'beginningAndEnd';
        } else {
            if (forward) {
                return 'start';
            } else {
                return 'end';
            }
        }
    } else {
        if (annotationRange.end === enclosingRangeType.end) {
            if (forward) {
                return 'end';
            } else {
                return 'start';
            }
        } else {
            return 'middle';
        }
    }
};