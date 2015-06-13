module.exports = function isPositiveInteger(value) {
	if (value === null || Array.isArray(value)) {
		return false;
	}
	if (
		value % 1 === 0 &&
		value > -1
	) {
		return true;
	} else {
		return false;
	}
};