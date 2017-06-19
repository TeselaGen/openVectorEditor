import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString';
var assign = require('lodash/object/assign');

function searchSequence({input: { searchString, dna, literal }, state, output}) {
    state.set('searchString', searchString)

    var originalInput = searchString;
    searchString = searchString.toLowerCase();

    var ambiguous = {
        'y':'(c|t)', 'r':'(a|g)',
        'k':'(g|t)', 'm':'(a|c)',
        'w':'(a|t)', 's':'(c|g)',
        'd':'(a|g|t)', 'h':'(a|c|t)',
        'v':'(a|c|g)', 'b':'(c|g|t)',
        'x':'(a|c|g|t)', 'n':'(a|c|g|t)',
    };

    var aminoAcids = {
        'a':'(gc(a|c|g|t))',
        'r':'((cg(a|c|g|t))|(ag(a|g)))',
        'n':'(aa(c|t))',
        'd':'(ga(c|t))',
        'c':'(tg(c|t))',
        'q':'(ca(a|g))',
        'e':'(ga(a|g))',
        'g':'(gg(a|c|g|t))',
        'h':'(ca(c|t))',
        'i':'(at(a|c|t))',
        'l':'((tt(a|g))|(ct(a|c|g|t)))',
        'k':'(aa(a|g))',
        'm':'(atg)',
        'f':'(tt(c|t))',
        'p':'(cc(a|c|g|t))',
        's':'((tc(a|c|g|t))|(ag(c|t)))',
        't':'(ac(a|c|g|t))',
        'w':'(tgg)',
        'y':'(ta(c|t))',
        'v':'(gt(a|c|g|t))',
        'u':'((ta(a|g))|(tga))', // stop
        'o':'((ta(a|g))|(tga))', // also stop
        '*':'((ta(a|g))|(tga))' //  yet another stop
    };

    var ambiguousAminoAcids = {
        'b':'(g|a)a(c|t)', // N or D
        'z':'(c|g)a(a|g)', // Q or E
        'j':'((at(a|c|t))|(tt(a|g))|(ct(a|c|g|t)))', // I or L
        'x':'(([^t]..)|(t[^ag].)|(ta[^ag])|(tg[^a]))', // anything except stop (there's probably a more elegant regexp i could use, but this works...)
    };

    var match;
    var layers = [];

    // amino acid search
    if (dna === "Amino Acids") {
        var string = "";
        for (let i=0; i<searchString.length; i++) {
            if (!aminoAcids[searchString[i]]) {
                string += searchString[i];
            } else {
                string += aminoAcids[searchString[i]];
            }
        }
        searchString = string;
    }

    // amino acid search with ambiguous
    if (dna === "Amino Acids" && literal === "Ambiguous") {
        var string = "";
        for (let i=0; i<searchString.length; i++) {
            if (!ambiguousAminoAcids[searchString[i]]) {
                string += searchString[i];
            } else {
                string += ambiguousAminoAcids[searchString[i]];
            }
        }
        searchString = string;

    // dna search with ambiguous
    } else if (literal === "Ambiguous") {
        var string = "";
        for (let i=0; i<searchString.length; i++) {
            if (!ambiguous[searchString[i]]) {
                string += searchString[i];
            } else {
                string += ambiguous[searchString[i]];
            }
        }
        searchString = string;
    }

    // make sure input is valid regexp
    try {
        var regex = new RegExp(searchString, 'gi');
    } catch(e) {
        state.set('searchLayers', []);
        return;
    }

    // wrap around origin
    var sequence = state.get(['sequenceData', 'sequence']);
    var circular = state.get(['sequenceData', 'circular']);
    var sequenceExtended = sequence;
    if (circular) {
        var extend = originalInput.length;
        if (dna === "Amino Acids") {
            extend *= 3;
        }
        sequenceExtended += sequence.slice(0, extend-1);
    }

    // get regex to search reverse sequence
    var reverseSequence = getComplementSequenceString(sequenceExtended);
    reverseSequence = reverseSequence.split("").reverse().join("");
    var uniqueHash = {}; //things get crazy if there are duplicates;

    //finally execute the search
    do {
        match = regex.exec(sequenceExtended);
        if (match && match[0].length === 0) {
            state.set('searchLayers', []);
            return;
            // because even though the regex may be "technically" valid, it can still do some weird stuff and crash the app
        }
        if (match) {
            var start = match.index;
            var end = start + match[0].length - 1;

            // wraps around origin
            if (end > sequence.length - 1) {
                end -= sequence.length;
            }
            regex.lastIndex = match.index+1;
            layers.push({
                start: start,
                end: end,
                selected: false
            });
            uniqueHash[start+','+end] = 1;
        }
    } while (match);

    if (state.get('showReverseSequence')) {
        do {
            match = regex.exec(reverseSequence);
            if (match && match[0].length === 0) {
                state.set('searchLayers', []);
                return;
                // because even though the regex may be "technically" valid, it can still do some weird stuff and crash the app
            }
            if (match) {
                var end = match.index;
                end = sequenceExtended.length - end - 1;
                var start = end - match[0].length + 1;

                // wraps around origin
                if (end > sequence.length - 1) {
                    end -= sequence.length;
                }
                regex.lastIndex = match.index+1;
                if (!uniqueHash[start+','+end]) {
                    layers.push({
                        start: start,
                        end: end,
                        selected: false
                    });
                }
            }
        } while (match);

        layers.sort(function (a,b) {
            return a.start - b.start;
        });
    }

    state.set('searchLayers', layers);
}

module.exports = searchSequence;
