var getRangeLength = require('./getRangeLength');
module.exports = function getRangeAngles(range, rangeMax) {
    var rangeLength = getRangeLength(range, rangeMax);
    return {
                startAngle: 2 * Math.PI * (range.start / rangeMax),
                endAngle: 2 * Math.PI * (range.end + 1) / rangeMax, //return +1 here because the angle must encompass the end of the annotation
                totalAngle: rangeLength / rangeMax * Math.PI * 2
            }
};

