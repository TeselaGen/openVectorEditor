var assign = require('lodash/object/assign');

function searchSequence({input: { searchString, dna, literal }, state, output}) {
    state.set('searchString', searchString)

    if (!searchString || searchString.length < 3) {
        state.set('searchLayers', []);
        return;
    }

    var originalInput = searchString;
    searchString = searchString.toLowerCase();

    var dnaComplement = {
        'a':'t', 'c':'g', 'g':'c', 't':'a',
        '(':')', ')':'('
    };

    var ambiguous = {
        'y':'(c|t)', 'r':'(a|g)',
        'k':'(g|t)', 'm':'(a|c)',
        'w':'(a|t)', 's':'(c|g)',
        'd':'(a|g|t)', 'h':'(a|c|t)',
        'v':'(a|c|g)', 'b':'(c|g|t)',
        'x':'(a|c|g|t)', 'n':'(a|c|g|t)'
    };

    var aminoAcids = {
        'a':'gc(a|c|g|t)',
        'r':'((cg(a|c|g|t))|(ag(a|g)))',
        'n':'aa(c|t)',
        'd':'ga(c|t)',
        'c':'tg(c|t)',
        'q':'ca(a|g)',
        'e':'ga(a|g)',
        'g':'gg(a|c|g|t)',
        'h':'ca(c|t)',
        'i':'at(a|c|t)',
        'l':'((tt(a|g))|(ct(a|c|g|t)))',
        'k':'aa(a|g)',
        'm':'atg',
        'f':'tt(c|t)',
        'p':'cc(a|c|g|t)',
        's':'((tc(a|c|g|t))|(ag(c|t)))',
        't':'ac(a|c|g|t)',
        'w':'tgg',
        'y':'ta(c|t)',
        'v':'gt(a|c|g|t)',
        'u':'((ta(a|g))|(tga))', // stop
        'o':'((ta(a|g))|(tga))', // also stop
        '*':'((ta(a|g))|(tga))' //  yet another stop
    };

    var ambiguousAminoAcids = {
        'b':'(g|a)a(c|t)', // N or D
        'z':'(c|g)a(a|g)', // Q or E
        'j':'((at(a|c|t))|(tt(a|g))|(ct(a|c|g|t)))' // I or L
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

    // get regex to search reverse sequence
    var reverseSearchString = "";
    for (let i=0; i<searchString.length; i++) {
        if (dnaComplement[searchString[i]]) {
            reverseSearchString = dnaComplement[searchString[i]] + reverseSearchString;
        } else {
            reverseSearchString = searchString[i] + reverseSearchString;
        }
    }

    var reg = '('+searchString+')|('+reverseSearchString+')';
    // make sure input is valid regexp
    try {
        var regex = new RegExp(reg, 'gi');
    } catch(e) {
        state.set('searchLayers', []);
        return;
    }

    // wrap around origin
    var sequence = state.get(['sequenceData', 'sequence']);
    var extend = originalInput.length;
    if (dna === "Amino Acids") {
        extend *= 3;
    }
    var sequenceExtended = sequence + sequence.slice(0, extend-1);
    // finally execute the search
    do {
        match = regex.exec(sequenceExtended);
        if (match && match[0].length === 0) {
            state.set('searchLayers', []);
            return;
            // because even though the regex may be "technically" valid, it can still do some weird stuff and crash the app
        }
        if (match) {
            // wraps around origin
            var end = match.index + match[0].length - 1;
            if (end > sequence.length - 1) {
                end -= sequence.length;
            }

            layers.push({
                start: match.index,
                end: end,
                selected: false
            });
        }
    } while (match);
    state.set('searchLayers', layers);
}

module.exports = searchSequence;
