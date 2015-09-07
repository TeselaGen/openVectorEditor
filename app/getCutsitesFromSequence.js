
/* @flow */
var Validate = require('validate-arguments');
module.exports = function getCutsitesFromSequence(sequence, circular, restrictionEnzymes) {
    debugger;
    
    var args = Validate.positional(arguments, [
        'string', 'boolean', [{
            "name": "string",
            "site": "string",
            "forwardRegex": "string",
            "reverseRegex": "number",
            "cutType": "whole",
            "dsForward": "whole",
            "dsReverse": "whole",
            "usForward": "whole",
            "usReverse": "whole"
        }]
    ]);

    if (!args.isValid()) {
        throw args.errorString();
    }

    var cutsitesByName = {};
    // var allCutsite= [];
    for (var i = 0; i < restrictionEnzymes.length; i++) {
        var re = restrictionEnzymes[i];
        cutsitesByName[re.name()] = this.cutSequenceByRestrictionEnzyme(re, sequence);
    }
    return cutsitesByName;
}

/**
 * Cut sequence with one restriction enzyme. See Teselagen.bio.enzymes.RestrictionCutSite.
 * @param {RestrictionEnzyme} restrictionEnzyme Restriction enzyme to cut the sequence with.
 * @param {sequence} sequence DNA sequence.
 * @return {Array} List of RestrictionCutSite's.
 */
function cutSequenceByRestrictionEnzyme(restrictionEnzyme, sequence) {
    var restrictionCutSites = [];
    var restrictionCutSite;

    var forwardRegExpPattern = new RegExp(restrictionEnzyme.forwardRegex().toLowerCase(), "g");
    var reverseRegExpPattern = new RegExp(restrictionEnzyme.reverseRegex().toLowerCase(), "g");

    var reLength = restrictionEnzyme.site().length;
    if (reLength != restrictionEnzyme.dsForward() + restrictionEnzyme.dsReverse()) {
        reLength = restrictionEnzyme.dsForward();
    }

    if (!sequence) return null;
    var sequence = sequence.toLowerCase();
    var seqLength = sequence.length;

    var matchIndex = sequence.search(forwardRegExpPattern);
    var startIndex = 0;
    var subSequence = sequence;

    var start;
    var end;

    while (matchIndex != -1) {
        if (matchIndex + startIndex + reLength - 1 >= sequence.length) { // subSequence is too short
            break;
        }

        start = matchIndex + startIndex;
        end = matchIndex + reLength + startIndex;

        restrictionCutSite = {
            start: start,
            end: end,
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

    if (!restrictionEnzyme.isPalindromic()) {
        matchIndex = sequence.search(reverseRegExpPattern);
        startIndex = 0;
        subSequence = sequence;
        while (matchIndex != -1) {
            if (matchIndex + startIndex + reLength - 1 >= sequence.length) { // subSequence is too short
                break;
            }

            start = matchIndex + startIndex -
                (restrictionEnzyme.dsForward() - restrictionEnzyme.site().length);
            end = start + reLength;

            if (start >= 0) {
                restrictionCutSite = {
                    start: start,
                    end: end,
                    forward: false,
                    restrictionEnzyme: restrictionEnzyme
                };

                restrictionCutSites.push(restrictionCutSite);
            }

            // Make sure that we always store the previous match index to ensure
            // that we are always storing indices relative to the whole sequence,
            // not just the subSequence.
            startIndex = startIndex + matchIndex + 1;

            // Search again on subSequence, starting from the index of the last match + 1.
            subSequence = sequence.substring(startIndex, sequence.length);
            matchIndex = subSequence.search(reverseRegExpPattern);
        }
    }
    return restrictionCutSites;
}