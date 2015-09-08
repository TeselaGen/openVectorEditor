var getReverseComplementSequenceString = require('./getReverseComplementSequenceString');
var Validate = require('validate-arguments');
var ac = require('./apiCheck');
var normalizePositionByRangeLength = require('./normalizePositionByRangeLength.js');
var reversePositionInRange = require('./reversePositionInRange.js');

module.exports = function cutsitesFromSequence(sequence, circular, restrictionEnzymes) {
    //validate args!
    ac.throw([
        ac.string,
        ac.bool,
        ac.arrayOf(
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
            }))
    ], arguments);

    var cutsitesByName = {};
    // var allCutsite= [];
    for (var i = 0; i < restrictionEnzymes.length; i++) {
        var re = restrictionEnzymes[i];
        cutsitesByName[re.name] = cutSequenceByRestrictionEnzyme(re, sequence, circular);
    }
    debugger;
    return cutsitesByName;
};

/**
 * Cut sequence with one restriction enzyme. See Teselagen.bio.enzymes.RestrictionCutSite.
 * @param {RestrictionEnzyme} restrictionEnzyme Restriction enzyme to cut the sequence with.
 * @param {sequence} sequence DNA sequence.
 * @return {Array} List of RestrictionCutSite's.
 */
function cutSequenceByRestrictionEnzyme(restrictionEnzyme, sequence) {
    debugger;
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
        cutsite.dsTopSnip = reversePositionInRange(cutsite.dsTopSnip, rangeLength);
        cutsite.dsBottomSnip = reversePositionInRange(cutsite.dsBottomSnip, rangeLength);
        cutsite.usTopSnip = reversePositionInRange(cutsite.usTopSnip, rangeLength);
        cutsite.usBottomSnip = reversePositionInRange(cutsite.usBottomSnip, rangeLength);
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
        var usTopSnip; //upstream top snip position
        var usBottomSnip; //upstream bottom snip position
        var dsTopSnip; //downstream top snip position
        var dsBottomSnip; //downstream bottom snip position

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
                usTopSnip = recognitionSiteRange.start - restrictionEnzyme.usForward;
                usBottomSnip = recognitionSiteRange.start - restrictionEnzyme.usReverse;
                if (usTopSnip < usBottomSnip) {
                    start = usTopSnip;
                } else {
                    start = usBottomSnip;
                }
            }

            //add downstream cutsite here
            dsTopSnip = recognitionSiteRange.start + restrictionEnzyme.dsForward;
            dsBottomSnip = recognitionSiteRange.start + restrictionEnzyme.dsReverse;
            if (dsTopSnip > dsBottomSnip) {
                if (dsTopSnip > recognitionSiteRange.end) {
                    end = dsTopSnip;
                }
            } else {
                if (dsBottomSnip > recognitionSiteRange.end) {
                    end = dsBottomSnip;
                }
            }

            try {
                start = normalizePositionByRangeLength(start, sequenceLength, circular);
                end = normalizePositionByRangeLength(end, sequenceLength, circular);
                dsTopSnip = normalizePositionByRangeLength(dsTopSnip, sequenceLength, circular);
                dsBottomSnip = normalizePositionByRangeLength(dsBottomSnip, sequenceLength, circular);
                usTopSnip = normalizePositionByRangeLength(usTopSnip, sequenceLength, circular);
                usBottomSnip = normalizePositionByRangeLength(usBottomSnip, sequenceLength, circular);
                recognitionSiteRange.start = normalizePositionByRangeLength(recognitionSiteRange.start, sequenceLength, circular);
                recognitionSiteRange.end = normalizePositionByRangeLength(recognitionSiteRange.end, sequenceLength, circular);

                //if any of the above normalizations throw errors, we won't push the cutsite onto the array!
                restrictionCutSite = {
                    start: start,
                    end: end,
                    dsTopSnip: dsTopSnip,
                    dsBottomSnip: dsBottomSnip,
                    usTopSnip: usTopSnip,
                    usBottomSnip: usBottomSnip,
                    recognitionSiteRange: recognitionSiteRange,
                    forward: true,
                    restrictionEnzyme: restrictionEnzyme
                };
                restrictionCutSites.push(restrictionCutSite);
            } catch (e) {
                //do nothing, we just won't push anything into the restrictionCutSites array
                debugger;
            }

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