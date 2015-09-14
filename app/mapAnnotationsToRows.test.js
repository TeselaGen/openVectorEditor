// var tap = require('tap');
// tap.mochaGlobals();
var expect = require('chai').expect;
var mapAnnotationsToRows = require('../app/mapAnnotationsToRows.js');
describe('mapAnnotationsToRows', function() {
	it('maps overlapping annotations to rows correctly', function() {
		var annotation1 = {
			start: 0,
			end: 9,
			id: 'a'
		};
		var annotation2 = {
			start: 0,
			end: 9,
			id: 'b'
		};
		var annotations = [annotation1, annotation2];
		var sequenceLength = 10;
		var bpsPerRow = 5;
		var annotationsToRowsMap = mapAnnotationsToRows(annotations, sequenceLength, bpsPerRow);
		expect(annotationsToRowsMap).to.deep.equal({
			0: [{
				annotation: annotation1,
				start: 0,
				end: 4,
				id: annotation1.id,
				yOffset: 0,
				enclosingRangeType: "beginningAndEnd"
			},{
				start: 0,
				end: 4,
				id: annotation2.id,
				yOffset: 1,
				annotation: annotation2,
				enclosingRangeType: "beginningAndEnd"
			}],
			1: [{
				annotation: annotation1,
				start: 5,
				end: 9,
				id: annotation1.id,
				yOffset: 0,
				enclosingRangeType: "beginningAndEnd"
			},{
				start: 5,
				end: 9,
				id: annotation2.id,
				yOffset: 1,
				annotation: annotation2,
				enclosingRangeType: "beginningAndEnd"
			}]
		});
	});
	it('maps single annotation to rows correctly', function() {
		var annotation1 = {
			start: 0,
			end: 9
		};
		var annotations = [annotation1];
		var sequenceLength = 10;
		var bpsPerRow = 5;
		var annotationsToRowsMap = mapAnnotationsToRows(annotations, sequenceLength, bpsPerRow);
		expect(annotationsToRowsMap).to.deep.equal({
			0: [{
				annotation: annotation1,
				start: 0,
				end: 4,
				id: annotation1.id,
				yOffset: 0,
				enclosingRangeType: "beginningAndEnd"
			}],
			1: [{
				annotation: annotation1,
				start: 5,
				end: 9,
				id: annotation1.id,
				yOffset: 0,
				enclosingRangeType: "beginningAndEnd"
			}]
		});
	});
});