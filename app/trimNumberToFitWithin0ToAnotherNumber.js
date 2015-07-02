module.exports = function trimNumberToFitWithin0ToAnotherNumber(numberToBeTrimmed, max) {
	if (numberToBeTrimmed < 0) {
		numberToBeTrimmed = 0;
	}
	if (numberToBeTrimmed > max) {
		numberToBeTrimmed = max;
	}
	return numberToBeTrimmed;
};