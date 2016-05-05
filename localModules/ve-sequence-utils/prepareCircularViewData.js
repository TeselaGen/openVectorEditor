var cloneDeep = require('lodash/cloneDeep');
// var ac = require('ve-api-check');
var getYOffsetsForPotentiallyCircularRanges = require('ve-range-utils/getYOffsetsForPotentiallyCircularRanges');
var annotationTypes = require('ve-sequence-utils/annotationTypes');
//basically just adds yOffsets to the annotations
module.exports = function prepareCircularViewData(sequenceData) {
    var clonedSeqData = cloneDeep(sequenceData)
    annotationTypes.forEach(function(annotationType){
        if (annotationType !== 'cutsites') {
            var maxYOffset = getYOffsetsForPotentiallyCircularRanges(clonedSeqData[annotationType]).maxYOffset;
            clonedSeqData[annotationType].maxYOffset = maxYOffset;
        }
    });
    return clonedSeqData;
}
