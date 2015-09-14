var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var isNonNegativeInteger = require('validate.io-nonnegative-integer');
var ac = require('api-check')({
    /* config options */
    output: {
        prefix: '',
        suffix: 'Good luck!',
        docsBaseUrl: 'no docs yet!'
    },
    verbose: false
}, {
    /* custom checkers! */
    posInt: posInt,
    posIntArray: posIntArray,
    range: range
    // sequenceData: function (val, name, location) {
    //     if (!val || !areNonNegativeIntegers([val.start, val.end])) {
    //         return ac.utils.getError(name, location, 'val is not a valid range!');
    //     }

    //     ac.shape({
    //             "name": ac.string,
    //             "site": ac.string,
    //             "forwardRegex": ac.string,
    //             "reverseRegex": ac.string,
    //             "cutType": ac.number,
    //             "dsForward": ac.number,
    //             "dsReverse": ac.number,
    //             "usForward": ac.number,
    //             "usReverse": ac.number
    //         })
    // }
});

function posInt (val, name, location) {
    if (!isNonNegativeInteger(val)) {
        return ac.utils.getError(name, location, posInt.type);
    }
}
posInt.type = 'non-negative integer!';
function posIntArray (val, name, location) {
    if (!areNonNegativeIntegers(val)) {
        return ac.utils.getError(name, location, posIntArray.type);
    }
}
posIntArray.type = 'array of non-negative integers!';
function range (val, name, location) {
    if (!val || !areNonNegativeIntegers([val.start, val.end])) {
        return ac.utils.getError(name, location, range.type);
    }
}
range.type = 'valid range with start and end!'

module.exports = ac;