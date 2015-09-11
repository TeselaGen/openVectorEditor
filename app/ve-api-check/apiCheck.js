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
    posInt: function (val, name, location) {
        if (!isNonNegativeInteger(val)) {
            return ac.utils.getError(name, location, 'val is not a non-negative integer!');
        }
    },
    posIntArray: function (val, name, location) {
        if (!areNonNegativeIntegers(val)) {
            return ac.utils.getError(name, location, 'val is not an array of non-negative integers!');
        }
    },
    range: function (val, name, location) {
        if (!val || !areNonNegativeIntegers([val.start, val.end])) {
            return ac.utils.getError(name, location, 'val is not a valid range!');
        }
    },
    sequenceData: function (val, name, location) {
        if (!val || !areNonNegativeIntegers([val.start, val.end])) {
            return ac.utils.getError(name, location, 'val is not a valid range!');
        }
        
        ac.shape({
                "name": ac.string,
                "site": ac.string,
                "forwardRegex": ac.string,
                "reverseRegex": ac.string,
                "cutType": ac.number,
                "dsForward": ac.number,
                "dsReverse": ac.number,
                "usForward": ac.number,
                "usReverse": ac.number
            })
    },
    randomData: function (val, name, location) {
        ac.throw([
            ac.shape({
                "name": ac.string,
                "site": ac.string,
                "forwardRegex": ac.string,
                "reverseRegex": ac.string,
                "cutType": ac.number,
                "dsForward": ac.number,
                "dsReverse": ac.number,
                "usForward": ac.number,
                "usReverse": ac.number
            })
        ], val);
    },
});
module.exports = ac;