module.exports = function spliceSlice(str, index, count, add) {
	return str.slice(0, index) + (add || "") + str.slice(index + count);
};