var getReverseComplementSequenceString = require('./getReverseComplementSequenceString');
var ac = require('./apiCheck');
var normalizePositionByRangeLength = require('./normalizePositionByRangeLength.js');
var reversePositionInRange = require('./reversePositionInRange.js');

/**
 * Cut sequence with one restriction enzyme. See Teselagen.bio.enzymes.RestrictionCutSite.
 * @param {RestrictionEnzyme} restrictionEnzyme Restriction enzyme to cut the sequence with.
 * @param {sequence} sequence DNA sequence.
 * @return {Array} List of RestrictionCutSite's.
 */
module.exports = function cutSequenceByRestrictionEnzyme(sequence, circular, restrictionEnzyme) {
    ac.throw([
        ac.string,
        ac.bool,
        ac.shape({
            "name": ac.string,
            "site": ac.string,
            "forwardRegex": ac.string,
            "reverseRegex": ac.string,
            "cutType": ac.number,
            "dsForward": ac.number,
            "dsReverse": ac.number,
            "usForward": ac.number,
            "usReverse": ac.number
        })
    ], arguments);
    var reverseRegExpPattern = new RegExp(restrictionEnzyme.reverseRegex, "ig");

    var forwardRegExpPattern = new RegExp(restrictionEnzyme.forwardRegex, "ig");
    var cutSitesForward = cutSequence(forwardRegExpPattern, restrictionEnzyme, sequence);
    var cutSitesReverse = [];
    if (restrictionEnzyme.forwardRegex !== restrictionEnzyme.reverseRegex) {
        var revSequence = getReverseComplementSequenceString(sequence);
        cutSitesReverse = cutSequence(forwardRegExpPattern, restrictionEnzyme, revSequence);
        cutSitesReverse.forEach(function(cutsite) {
            cutsite = reverseAllPositionsOfCutsite(cutsite);
        });
    }
    return (cutSitesForward.concat(cutSitesReverse));

    function reverseAllPositionsOfCutsite(cutsite, rangeLength) {
        cutsite.start = reversePositionInRange(cutsite.start, rangeLength);
        cutsite.end = reversePositionInRange(cutsite.end, rangeLength);
        cutsite.downStreamTopSnip = reversePositionInRange(cutsite.downStreamTopSnip, rangeLength);
        cutsite.downStreamBottomSnip = reversePositionInRange(cutsite.downStreamBottomSnip, rangeLength);
        cutsite.upstreamTopSnip = reversePositionInRange(cutsite.upstreamTopSnip, rangeLength);
        cutsite.upstreamBottomSnip = reversePositionInRange(cutsite.upstreamBottomSnip, rangeLength);
        cutsite.recognitionSiteRange.start = reversePositionInRange(cutsite.recognitionSiteRange.start, rangeLength);
        cutsite.recognitionSiteRange.end = reversePositionInRange(cutsite.recognitionSiteRange.end, rangeLength);
        return cutsite;
    }

    function cutSequence(regExpPattern, restrictionEnzyme, sequence) {
        var restrictionCutSites = [];
        var restrictionCutSite;
        var reLength = restrictionEnzyme.site.length;
        // if (reLength != restrictionEnzyme.dsForward + restrictionEnzyme.dsReverse) {
        //     reLength = restrictionEnzyme.dsForward;
        // }

        sequence = sequence;
        var sequenceLength = sequence.length;

        var matchIndex = sequence.search(forwardRegExpPattern);
        var startIndex = 0;
        var subSequence = sequence;

        var recognitionSiteRange = {};
        var start; //start and end should fully enclose the enzyme snips and the recognition site!
        var end;
        var upstreamTopSnip; //upstream top snip position
        var upstreamBottomSnip; //upstream bottom snip position
        var downStreamTopSnip; //downstream top snip position
        var downStreamBottomSnip; //downstream bottom snip position

        while (matchIndex != -1) {
            // if (matchIndex + startIndex + reLength - 1 >= sequence.length) { // subSequence is too short
            //     break;
            // }

            recognitionSiteRange.start = matchIndex + startIndex;
            start = recognitionSiteRange.start; //this might change later on!
            recognitionSiteRange.end = matchIndex + reLength + startIndex;
            end = recognitionSiteRange.end; //this might change later on!

            //we need to get the snip sites, top and bottom for each of these cut sites
            //as well as all of the bp's between the snip sites

            //if the cutSite is type 1, it cuts both upstream and downstream of its recognition site (cutSite type 0's cut only downstream)
            if (restrictionEnzyme.cutType == 1) { //double cutter, add upstream cutsite here
                upstreamTopSnip = recognitionSiteRange.start - restrictionEnzyme.usForward;
                upstreamBottomSnip = recognitionSiteRange.start - restrictionEnzyme.usReverse;
                if (upstreamTopSnip < upstreamBottomSnip) {
                    start = upstreamTopSnip;
                } else {
                    start = upstreamBottomSnip;
                }
                upstreamTopSnip = normalizePositionByRangeLength(upstreamTopSnip, sequenceLength);
                upstreamBottomSnip = normalizePositionByRangeLength(upstreamBottomSnip, sequenceLength);
            }

            //add downstream cutsite here
            downStreamTopSnip = recognitionSiteRange.start + restrictionEnzyme.dsForward;
            downStreamBottomSnip = recognitionSiteRange.start + restrictionEnzyme.dsReverse;
            if (downStreamTopSnip > downStreamBottomSnip) {
                if (downStreamTopSnip > recognitionSiteRange.end) {
                    end = downStreamTopSnip;
                }
            } else {
                if (downStreamBottomSnip > recognitionSiteRange.end) {
                    end = downStreamBottomSnip;
                }
            }

            if (start < 0 || end < 0 || start >= sequenceLength || end >= sequenceLength && !circular) {
                return; //return early because the cutsite does not fully fit within the boundownStream of the sequence!
            }

            start = normalizePositionByRangeLength(start, sequenceLength);
            end = normalizePositionByRangeLength(end, sequenceLength);
            downStreamTopSnip = normalizePositionByRangeLength(downStreamTopSnip, sequenceLength);
            downStreamBottomSnip = normalizePositionByRangeLength(downStreamBottomSnip, sequenceLength);
            recognitionSiteRange.start = normalizePositionByRangeLength(recognitionSiteRange.start, sequenceLength);
            recognitionSiteRange.end = normalizePositionByRangeLength(recognitionSiteRange.end, sequenceLength);

            restrictionCutSite = {
                start: start,
                end: end,
                downStreamTopSnip: downStreamTopSnip,
                downStreamBottomSnip: downStreamBottomSnip,
                upstreamTopSnip: upstreamTopSnip,
                upstreamBottomSnip: upstreamBottomSnip,
                recognitionSiteRange: recognitionSiteRange,
                forward: true,
                restrictionEnzyme: restrictionEnzyme
            };
            restrictionCutSites.push(restrictionCutSite);

            // Make sure that we always store the previous match index to ensure
            // that we are always storing indices relative to the whole sequence,
            // not just the subSequence.
            startIndex = startIndex + matchIndex + 1;

            // Search again on subSequence, starting from the index of the last match + 1.
            subSequence = sequence.substring(startIndex, sequence.length);
            matchIndex = subSequence.search(forwardRegExpPattern);
        }
        return restrictionCutSites;
    }

    // if (!restrictionEnzyme.forwardRegex !== restrictionEnzyme.reverseRegex) {
    //     matchIndex = sequence.search(reverseRegExpPattern);
    //     startIndex = 0;
    //     subSequence = sequence;
    //     while (matchIndex != -1) {
    //         if (matchIndex + startIndex + reLength - 1 >= sequence.length) { // subSequence is too short
    //             break;
    //         }

    //         recognitionSiteRange.start = matchIndex + startIndex -
    //             (restrictionEnzyme.dsForward - restrictionEnzyme.site.length);
    //         recognitionSiteRange.end = recognitionSiteRange.start + reLength;

    //         if (recognitionSiteRange.start >= 0) {
    //             restrictionCutSite = {
    //                 recognitionSiteRange: recognitionSiteRange,
    //                 forward: false,
    //                 restrictionEnzyme: restrictionEnzyme
    //             };

    //             restrictionCutSites.push(restrictionCutSite);
    //         }

    //         // Make sure that we always store the previous match index to ensure
    //         // that we are always storing indices relative to the whole sequence,
    //         // not just the subSequence.
    //         startIndex = startIndex + matchIndex + 1;

    //         // Search again on subSequence, starting from the index of the last match + 1.
    //         subSequence = sequence.substring(startIndex, sequence.length);
    //         matchIndex = subSequence.search(reverseRegExpPattern);
    //     }
    // }
    return restrictionCutSites;
}