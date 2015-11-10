var getRangeLength = require('./getRangeLength');
module.exports = function getRangeAngles(range, rangeMax) {
    var rangeLength = getRangeLength(range, rangeMax);
    return {
                startAngle: 2 * Math.PI * (range.start / rangeMax),
                endAngle: 2 * Math.PI * (range.end + 1) / rangeMax - 0.0000001, //return +1 here because the angle must encompass the end of the annotation
                totalAngle: rangeLength / rangeMax * Math.PI * 2 - 0.0000001 //subtract a tiny amount from the angle so that 0-2PI angles will draw correctly..
            }
};

