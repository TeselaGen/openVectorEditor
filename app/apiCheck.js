var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var isNonNegativeInteger = require('validate.io-nonnegative-integer');
var apiCheck = require('api-check')({
    /* config options */
    output: {
        prefix: 'open vector editor',
        suffix: 'Good luck!',
        docsBaseUrl: 'no docs yet!'
    },
    verbose: false
}, {
    /* custom checkers! */
    posInt: function (val, name, location) {
        if (!isNonNegativeInteger(val)) {
            apiCheck.utils.getError(name, location, 'val is not a non-negative integer!');
        }
    },
    posIntArray: function (val, name, location) {
        if (!areNonNegativeIntegers(val)) {
            apiCheck.utils.getError(name, location, 'val is not an array of non-negative integers!');
        }
    },
    range: function (val, name, location) {
        if (!val || !areNonNegativeIntegers([val.start, val.end])) {
            apiCheck.utils.getError(name, location, 'val is not a valid range!');
        }
    },
});
module.exports = apiCheck;