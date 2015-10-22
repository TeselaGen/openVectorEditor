var ac = require('ve-api-check');    
    // ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
module.exports = function trimNumberToFitWithin0ToAnotherNumber(numberToBeTrimmed, max) {
    ac.throw([ac.number, ac.number], arguments);
    if (numberToBeTrimmed < 0) {
        numberToBeTrimmed = 0;
    }
    if (numberToBeTrimmed > max) {
        numberToBeTrimmed = max;
    }
    return numberToBeTrimmed;
};