var tap = require('tap');
tap.mochaGlobals();
var expect = require('chai').expect;

var getOrfsFromSequence = require('../app/getOrfsFromSequence.js');
// getOrfsFromSequence(frame, sequence, minimumOrfSize, forward, circular)
describe('getOrfsFromSequence', function() {
	it('finds correct orfs in slightly more complex sequence', function() {
		var orfs = getOrfsFromSequence({
			frame: 0,
			sequence: 'atgatgffftaa',
			minimumOrfSize: 0,
			forward: true,
			circular: false,
		});
		expect(orfs).to.be.length(1);
		var orf = orfs[0];
		expect(orf).to.be.an('object');
		expect(orf.start).to.equal(0);
		expect(orf.end).to.equal(11);
		expect(orf.forward).to.equal(true);
		expect(orf.frame).to.equal(0);
		expect(orf.startCodonIndices).to.deep.equal([0,3]);
		expect(orf.id).to.be.a('string');
	});
	it('finds correct orfs in simple sequence', function() {
		var orfs = getOrfsFromSequence({
			frame: 0,
			sequence: 'atgtaa',
			minimumOrfSize: 0,
			forward: true,
			circular: false,
		});
		expect(orfs).to.be.length(1);
		var orf = orfs[0];
		expect(orf).to.be.an('object');
		expect(orf.start).to.equal(0);
		expect(orf.end).to.equal(5);
		expect(orf.forward).to.equal(true);
		expect(orf.frame).to.equal(0);
		expect(orf.startCodonIndices).to.deep.equal([0]);
		expect(orf.id).to.be.a('string');
	});
	it('finds correct orfs in simple sequence with different capitalizations', function() {
		var orfs = getOrfsFromSequence({
			frame: 0,
			sequence: 'ATGTAA',
			minimumOrfSize: 0,
			forward: true,
			circular: false,
		});
		expect(orfs).to.be.length(1);
		var orf = orfs[0];
		expect(orf).to.be.an('object');
		expect(orf.start).to.equal(0);
		expect(orf.end).to.equal(5);
		expect(orf.forward).to.equal(true);
		expect(orf.frame).to.equal(0);
		expect(orf.startCodonIndices).to.deep.equal([0]);
		expect(orf.id).to.be.a('string');
	});
	it('doesnt find orfs in simple sequence with no orfs', function() {
		var orfs = getOrfsFromSequence({
			frame: 0,
			sequence: 'gtgtaa',
			minimumOrfSize: 0,
			forward: true,
			circular: false,
		});
		expect(orfs).to.be.an('array');
		expect(orfs).to.be.length(0);
	});
});