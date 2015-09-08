var tap = require('tap');
tap.mochaGlobals();
var chai = require("chai");
chai.should();
var cutSequenceByRestrictionEnzyme = require('../app/cutSequenceByRestrictionEnzyme.js');
var enzymeList = require('../app/enzymeList.js');
// var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('../app/collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
describe('cutSequenceByRestrictionEnzyme', function() {
    it('correctly cuts with a simple, palindromic enzyme', function() {
        //bamhi
        // "BamHI": {
        //     "name": "BamHI",
        //     "site": "ggatcc",
        //     "forwardRegex": "g{2}atc{2}",
        //     "reverseRegex": "g{2}atc{2}",
        //     "cutType": 0,
        //     "dsForward": 1,
        //     "dsReverse": 5,
        //     "usForward": 0,
        //     "usReverse": 0
        // },
        debugger;
        var cutsites = cutSequenceByRestrictionEnzyme('ggatcc', true, enzymeList['BamHI']);
        cutsites.should.be.an.array;
        cutsites.length.should.equal(1);
        cutsites[0].start.should.equal(0);
        cutsites[0].end.should.equal(5);
        cutsites[0].downstreamTopSnip.should.equal(1);
        cutsites[0].downstreamBottomSnip.should.equal(5);
    });
});
// var getReverseComplementSequenceString = require('./getReverseComplementSequenceString');
// var Validate = require('validate-arguments');
// var ac = require('./apiCheck');
// var normalizePositionByRangeLength = require('./normalizePositionByRangeLength.js');
// var reversePositionInRange = require('./reversePositionInRange.js');

// /**
//  * Cut sequence with one restriction enzyme. See Teselagen.bio.enzymes.RestrictionCutSite.
//  * @param {RestrictionEnzyme} restrictionEnzyme Restriction enzyme to cut the sequence with.
//  * @param {sequence} sequence DNA sequence.
//  * @return {Array} List of RestrictionCutSite's.
//  */
// function cutSequenceByRestrictionEnzyme(sequence, circular, restrictionEnzyme) {
//     ac.throw([
//         ac.string,
//         ac.bool,
//         ac.shape({
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
//     ], arguments);
//     var reverseRegExpPattern = new RegExp(restrictionEnzyme.reverseRegex, "ig");

//     var forwardRegExpPattern = new RegExp(restrictionEnzyme.forwardRegex, "ig");
//     var cutSitesForward = cutSequence(forwardRegExpPattern, restrictionEnzyme, sequence);
//     var cutSitesReverse = [];
//     if (restrictionEnzyme.forwardRegex !== restrictionEnzyme.reverseRegex) {
//         var revSequence = getReverseComplementSequenceString(sequence);
//         cutSitesReverse = cutSequence(forwardRegExpPattern, restrictionEnzyme, revSequence);
//         cutSitesReverse.forEach(function(cutsite) {
//             cutsite = reverseAllPositionsOfCutsite(cutsite);
//         });
//     }
//     return (cutSitesForward.concat(cutSitesReverse));

//     function reverseAllPositionsOfCutsite(cutsite, rangeLength) {
//         cutsite.start = reversePositionInRange(cutsite.start, rangeLength);
//         cutsite.end = reversePositionInRange(cutsite.end, rangeLength);
//         cutsite.dsTopSnip = reversePositionInRange(cutsite.dsTopSnip, rangeLength);
//         cutsite.dsBottomSnip = reversePositionInRange(cutsite.dsBottomSnip, rangeLength);
//         cutsite.usTopSnip = reversePositionInRange(cutsite.usTopSnip, rangeLength);
//         cutsite.usBottomSnip = reversePositionInRange(cutsite.usBottomSnip, rangeLength);
//         cutsite.recognitionSiteRange.start = reversePositionInRange(cutsite.recognitionSiteRange.start, rangeLength);
//         cutsite.recognitionSiteRange.end = reversePositionInRange(cutsite.recognitionSiteRange.end, rangeLength);
//         return cutsite;
//     }

//     function cutSequence(regExpPattern, restrictionEnzyme, sequence) {
//         var restrictionCutSites = [];
//         var restrictionCutSite;
//         var reLength = restrictionEnzyme.site.length;
//         // if (reLength != restrictionEnzyme.dsForward + restrictionEnzyme.dsReverse) {
//         //     reLength = restrictionEnzyme.dsForward;
//         // }

//         sequence = sequence;
//         var sequenceLength = sequence.length;

//         var matchIndex = sequence.search(forwardRegExpPattern);
//         var startIndex = 0;
//         var subSequence = sequence;

//         var recognitionSiteRange = {};
//         var start; //start and end should fully enclose the enzyme snips and the recognition site!
//         var end;
//         var usTopSnip; //upstream top snip position
//         var usBottomSnip; //upstream bottom snip position
//         var dsTopSnip; //downstream top snip position
//         var dsBottomSnip; //downstream bottom snip position

//         while (matchIndex != -1) {
//             // if (matchIndex + startIndex + reLength - 1 >= sequence.length) { // subSequence is too short
//             //     break;
//             // }

//             recognitionSiteRange.start = matchIndex + startIndex;
//             start = recognitionSiteRange.start; //this might change later on!
//             recognitionSiteRange.end = matchIndex + reLength + startIndex;
//             end = recognitionSiteRange.end; //this might change later on!

//             //we need to get the snip sites, top and bottom for each of these cut sites
//             //as well as all of the bp's between the snip sites

//             //if the cutSite is type 1, it cuts both upstream and downstream of its recognition site (cutSite type 0's cut only downstream)
//             if (restrictionEnzyme.cutType == 1) { //double cutter, add upstream cutsite here
//                 usTopSnip = recognitionSiteRange.start - restrictionEnzyme.usForward;
//                 usBottomSnip = recognitionSiteRange.start - restrictionEnzyme.usReverse;
//                 if (usTopSnip < usBottomSnip) {
//                     start = usTopSnip;
//                 } else {
//                     start = usBottomSnip;
//                 }
//                 usTopSnip = normalizePositionByRangeLength(usTopSnip, sequenceLength);
//                 usBottomSnip = normalizePositionByRangeLength(usBottomSnip, sequenceLength);
//             }

//             //add downstream cutsite here
//             dsTopSnip = recognitionSiteRange.start + restrictionEnzyme.dsForward;
//             dsBottomSnip = recognitionSiteRange.start + restrictionEnzyme.dsReverse;
//             if (dsTopSnip > dsBottomSnip) {
//                 if (dsTopSnip > recognitionSiteRange.end) {
//                     end = dsTopSnip;
//                 }
//             } else {
//                 if (dsBottomSnip > recognitionSiteRange.end) {
//                     end = dsBottomSnip;
//                 }
//             }

//             if (start < 0 || end < 0 || start >= sequenceLength || end >= sequenceLength && !circular) {
//                 return; //return early because the cutsite does not fully fit within the bounds of the sequence!
//             }

//             start = normalizePositionByRangeLength(start, sequenceLength);
//             end = normalizePositionByRangeLength(end, sequenceLength);
//             dsTopSnip = normalizePositionByRangeLength(dsTopSnip, sequenceLength);
//             dsBottomSnip = normalizePositionByRangeLength(dsBottomSnip, sequenceLength);
//             recognitionSiteRange.start = normalizePositionByRangeLength(recognitionSiteRange.start, sequenceLength);
//             recognitionSiteRange.end = normalizePositionByRangeLength(recognitionSiteRange.end, sequenceLength);

//             restrictionCutSite = {
//                 start: start,
//                 end: end,
//                 dsTopSnip: dsTopSnip,
//                 dsBottomSnip: dsBottomSnip,
//                 usTopSnip: usTopSnip,
//                 usBottomSnip: usBottomSnip,
//                 recognitionSiteRange: recognitionSiteRange,
//                 forward: true,
//                 restrictionEnzyme: restrictionEnzyme
//             };
//             restrictionCutSites.push(restrictionCutSite);

//             // Make sure that we always store the previous match index to ensure
//             // that we are always storing indices relative to the whole sequence,
//             // not just the subSequence.
//             startIndex = startIndex + matchIndex + 1;

//             // Search again on subSequence, starting from the index of the last match + 1.
//             subSequence = sequence.substring(startIndex, sequence.length);
//             matchIndex = subSequence.search(forwardRegExpPattern);
//         }
//         return restrictionCutSites;
//     }

//     // if (!restrictionEnzyme.forwardRegex !== restrictionEnzyme.reverseRegex) {
//     //     matchIndex = sequence.search(reverseRegExpPattern);
//     //     startIndex = 0;
//     //     subSequence = sequence;
//     //     while (matchIndex != -1) {
//     //         if (matchIndex + startIndex + reLength - 1 >= sequence.length) { // subSequence is too short
//     //             break;
//     //         }

//     //         recognitionSiteRange.start = matchIndex + startIndex -
//     //             (restrictionEnzyme.dsForward - restrictionEnzyme.site.length);
//     //         recognitionSiteRange.end = recognitionSiteRange.start + reLength;

//     //         if (recognitionSiteRange.start >= 0) {
//     //             restrictionCutSite = {
//     //                 recognitionSiteRange: recognitionSiteRange,
//     //                 forward: false,
//     //                 restrictionEnzyme: restrictionEnzyme
//     //             };

//     //             restrictionCutSites.push(restrictionCutSite);
//     //         }

//     //         // Make sure that we always store the previous match index to ensure
//     //         // that we are always storing indices relative to the whole sequence,
//     //         // not just the subSequence.
//     //         startIndex = startIndex + matchIndex + 1;

//     //         // Search again on subSequence, starting from the index of the last match + 1.
//     //         subSequence = sequence.substring(startIndex, sequence.length);
//     //         matchIndex = subSequence.search(reverseRegExpPattern);
//     //     }
//     // }
//     return restrictionCutSites;
// }