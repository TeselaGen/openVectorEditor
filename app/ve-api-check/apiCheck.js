var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var isNonNegativeInteger = require('validate.io-nonnegative-integer');
var ac = require('api-check')({
    /* config options */
    output: {
        prefix: '',
        suffix: 'Good luck!',
        docsBaseUrl: 'no docs yet!'
    },
    verbose: false,
    disabled: true //tnr: build with NODE_ENV equal to 'production' to disable api-check
    // disabled: process.env.NODE_ENV === 'production' //tnr: build with NODE_ENV equal to 'production' to disable api-check
}, {
    /* custom checkers! */
    posInt: posInt,
    posIntArray: posIntArray,
    range: range,
    annotationType: annotationType
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

function posInt(val, name, location) {
    if (val === Infinity) return; //allow infinity to be one of the posInt types
    if (!isNonNegativeInteger(val)) {
        return ac.utils.getError(name, location, posInt.type);
    }
}
posInt.type = 'non-negative integer!';

function annotationType(val, name, location) {
    if (['features', 'parts', 'translations', 'orfs', 'cutsites'].indexOf(val) === -1) {
        return ac.utils.getError(name, location, annotationType.type);
    }
}
annotationType.type = 'non-negative integer!';

function posIntArray(val, name, location) {
    if (!areNonNegativeIntegers(val)) {
        return ac.utils.getError(name, location, posIntArray.type);
    }
}
posIntArray.type = 'array of non-negative integers!';

function range(val, name, location) {
    if (!val || !areNonNegativeIntegers([val.start, val.end])) {
        return ac.utils.getError(name, location, range.type);
    }
}
ac.range = ac.shape({
    start: ac.posInt,
    end: ac.posInt
})

ac.sequenceData = ac.shape({
    sequence: ac.string,
    features: ac.arrayOf(ac.range),
    parts: ac.arrayOf(ac.range),
    orfs: ac.arrayOf(ac.range),
    translations: ac.arrayOf(ac.range),
    cutsites: ac.arrayOf(ac.range)
});

module.exports = ac;