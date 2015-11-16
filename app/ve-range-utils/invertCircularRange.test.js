var invertCircularRange = require('./invertCircularRange');
describe('invertCircularRange', function () {
	it('should invert a non-circular range', function () {
		var invertedRange = invertCircularRange({start: 2, end:2}, 10);
		invertedRange.start.should.equal(3)
		invertedRange.end.should.equal(1)
	});
	it('should invert a non-circular range', function () {
		var invertedRange = invertCircularRange({start: 0, end:2}, 10);
		invertedRange.start.should.equal(3)
		invertedRange.end.should.equal(9)
	});
	it('should invert a non-circular range', function () {
		var invertedRange = invertCircularRange({start: 0, end:9}, 10);
		invertedRange.start.should.equal(0)
		invertedRange.end.should.equal(9)
	});
	it('should invert a non-circular range', function () {
		var invertedRange = invertCircularRange({start: 4, end:9}, 10);
		invertedRange.start.should.equal(0)
		invertedRange.end.should.equal(3)
	});
	it('should invert a circular range', function () {
		var invertedRange = invertCircularRange({start: 3, end:1}, 10);
		invertedRange.start.should.equal(2)
		invertedRange.end.should.equal(2)
	});
	it('should invert a circular range', function () {
		var invertedRange = invertCircularRange({start: 9, end:1}, 10);
		invertedRange.start.should.equal(2)
		invertedRange.end.should.equal(8)
	});
	it('should invert a circular range', function () {
		var invertedRange = invertCircularRange({start: 3, end:0}, 10);
		invertedRange.start.should.equal(1)
		invertedRange.end.should.equal(2)
	});
});