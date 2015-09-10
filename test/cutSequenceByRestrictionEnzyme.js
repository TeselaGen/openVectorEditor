// var tap = require('tap');
// tap.mochaGlobals();
var chai = require("chai");
chai.should();
var expect = chai.expect;
var cutSequenceByRestrictionEnzyme = require('../app/cutSequenceByRestrictionEnzyme.js');
var enzymeList = require('../app/enzymeList.js');
// var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('../app/collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
describe('a simple, palindromic enzyme', function() {
    //bamhi
    // "bamhi": {
    //     "name": "bamhi",
    //     "site": "ggatcdc",
    //     "forwardRegex": "g{2}atc{2}",
    //     "reverseRegex": "g{2}atc{2}",
    //     "cutType": 0,
    //     "dsForward": 1,
    //     "dsReverse": 5,
    //     "usForward": 0,
    //     "usReverse": 0
    // },
    it('cuts a single non-circular cutsite', function() {
        var cutsites = cutSequenceByRestrictionEnzyme('ggatcc', true, enzymeList['bamhi']);
        cutsites.should.be.an.array;
        cutsites.length.should.equal(1);
        cutsites[0].start.should.equal(0);
        cutsites[0].end.should.equal(5);
        cutsites[0].recognitionSiteRange.start.should.equal(0);
        cutsites[0].recognitionSiteRange.end.should.equal(5);
        cutsites[0].downstreamTopSnip.should.equal(1);
        cutsites[0].downstreamBottomSnip.should.equal(5);
        expect(cutsites[0].upstreamTopSnip).to.equal(undefined);
        expect(cutsites[0].upstreamBottomSnip).to.equal(undefined);
    });
    it('cuts a single circular cutsite', function() {
        var cutsites = cutSequenceByRestrictionEnzyme('ccrrrrggat', true, enzymeList['bamhi']);
        cutsites.should.be.an.array;
        cutsites.length.should.equal(1);
        cutsites[0].start.should.equal(6);
        cutsites[0].end.should.equal(1);
        cutsites[0].recognitionSiteRange.start.should.equal(6);
        cutsites[0].recognitionSiteRange.end.should.equal(1);
        cutsites[0].downstreamTopSnip.should.equal(7);
        cutsites[0].downstreamBottomSnip.should.equal(1);
        expect(cutsites[0].upstreamTopSnip).to.equal(undefined);
        expect(cutsites[0].upstreamBottomSnip).to.equal(undefined);
    });
    it('does not cut a circular cutsite if sequence is non-circular', function() {
        var cutsites = cutSequenceByRestrictionEnzyme('ccrrrrggat', false, enzymeList['bamhi']);
        cutsites.should.be.an.array;
        cutsites.length.should.equal(0);
    });
    it('cuts multiple times', function() {
        //bamhi
        // "bamhi": {
        //     "name": "bamhi",
        //     "site": "ggatcdc",
        //     "forwardRegex": "g{2}atc{2}",
        //     "reverseRegex": "g{2}atc{2}",
        //     "cutType": 0,
        //     "dsForward": 1,
        //     "dsReverse": 5,
        //     "usForward": 0,
        //     "usReverse": 0
        // },
        var cutsites = cutSequenceByRestrictionEnzyme('ggatccttttggatcc', true, enzymeList['bamhi']);
        cutsites.should.be.an.array;
        cutsites.length.should.equal(2);
        cutsites[0].start.should.equal(0);
        cutsites[0].end.should.equal(5);
        cutsites[0].recognitionSiteRange.start.should.equal(0);
        cutsites[0].recognitionSiteRange.end.should.equal(5);
        cutsites[0].downstreamTopSnip.should.equal(1);
        cutsites[0].downstreamBottomSnip.should.equal(5);
        expect(cutsites[0].upstreamTopSnip).to.equal(undefined);
        expect(cutsites[0].upstreamBottomSnip).to.equal(undefined);
        cutsites[1].start.should.equal(10);
        cutsites[1].end.should.equal(15);
        cutsites[1].recognitionSiteRange.start.should.equal(10);
        cutsites[1].recognitionSiteRange.end.should.equal(15);
        cutsites[1].downstreamTopSnip.should.equal(11);
        cutsites[1].downstreamBottomSnip.should.equal(15);
        expect(cutsites[1].upstreamTopSnip).to.equal(undefined);
        expect(cutsites[1].upstreamBottomSnip).to.equal(undefined);
    });
});
describe('non-palindromic enzyme', function() {
    // "bsmbi": {
    //     "name": "BsmBI",
    //     "site": "cgtctc",
    //     "forwardRegex": "cgtctc",
    //     "reverseRegex": "gagacg",
    //     "cutType": 0,
    //     "dsForward": 7,
    //     "dsReverse": 11,
    //     "usForward": 0,
    //     "usReverse": 0
    // },
    // 
    it('does not cut if the enzyme cuts outside of a linear sequence', function() {
        var cutsites = cutSequenceByRestrictionEnzyme('cgtctc', false, enzymeList['bsmbi']);
        cutsites.should.be.an.array;
        cutsites.length.should.equal(0);
    });
    it('does cut if the enzyme fits within circular sequence', function() {
        var cutsites = cutSequenceByRestrictionEnzyme('cgtctc', true, enzymeList['bsmbi']);
        cutsites.should.be.an.array;
        cutsites.length.should.equal(1);
        cutsites[0].start.should.equal(0);
        cutsites[0].end.should.equal(4);
        cutsites[0].recognitionSiteRange.start.should.equal(0);
        cutsites[0].recognitionSiteRange.end.should.equal(5);
        cutsites[0].downstreamTopSnip.should.equal(1);
        cutsites[0].downstreamBottomSnip.should.equal(5);
        expect(cutsites[0].upstreamTopSnip).to.equal(undefined);
    });
    it('does cut if the sequence is long enough', function() {
        // 0123456 7890 12345678
        // cgtctct tttt tttttttttttttttttt
        // rrrrrr
        //        |  dsTopSnip
        //             |  dsBottomSnip
        var cutsites = cutSequenceByRestrictionEnzyme('cgtctcttttttttttttttttttttttt', true, enzymeList['bsmbi']);
        cutsites.should.be.an.array;
        cutsites.length.should.equal(1);
        cutsites[0].start.should.equal(0);
        cutsites[0].end.should.equal(10);
        cutsites[0].recognitionSiteRange.start.should.equal(0);
        cutsites[0].recognitionSiteRange.end.should.equal(5);
        cutsites[0].downstreamTopSnip.should.equal(7);
        cutsites[0].downstreamBottomSnip.should.equal(11);
        expect(cutsites[0].upstreamTopSnip).to.equal(undefined);
        expect(cutsites[0].upstreamBottomSnip).to.equal(undefined);
    });
    it('cuts on reverse strand', function() {
        // 0123456 7890 12345678
        // cgtctct tttt tttttttttttttttttt
        // rrrrrr
        //        |  dsTopSnip
        //             |  dsBottomSnip
        var cutsites = cutSequenceByRestrictionEnzyme('aaaaaaaaaaaaaaaaaaaaaaagagacg', true, enzymeList['bsmbi']);
        cutsites.should.be.an.array;
        cutsites.length.should.equal(1);
        cutsites[0].start.should.equal(18);
        cutsites[0].end.should.equal(28);
        cutsites[0].recognitionSiteRange.start.should.equal(23);
        cutsites[0].recognitionSiteRange.end.should.equal(28);
        cutsites[0].downstreamTopSnip.should.equal(18);
        cutsites[0].downstreamBottomSnip.should.equal(22);
        expect(cutsites[0].upstreamTopSnip).to.equal(undefined);
        expect(cutsites[0].upstreamBottomSnip).to.equal(undefined);
    });
});