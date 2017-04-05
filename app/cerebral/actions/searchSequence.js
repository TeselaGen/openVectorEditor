var assign = require('lodash/object/assign');

function searchSequence({input: { searchString, dna, literal }, state, output}) {
    searchString = searchString.toLowerCase();
    state.set('searchString', searchString)
    if (searchString.length === 0) {
        output({ searchLayers: [] });
        return;
    }

    var dnaComplement = {
        'a':'t', 'c':'g', 'g':'c', 't':'a',
        'y':'r', 'r':'y', 'k':'m', 'm':'k',
        'd':'h', 'h':'d', 'b':'v', 'v':'b',
        'w':'w', 's':'s',
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
        'u':'((ta(a|g))|(tga))', // stop
        'o':'((ta(a|g))|(tga))', // also stop
        's':'((tc(a|c|g|t))|(ag(c|t)))',
        't':'ac(a|c|g|t)',
        'w':'tgg',
        'y':'ta(c|t)',
        'v':'gt(a|c|g|t)'
    };

    var ambiguousAminoAcids = {
        'b':'(g|a)a(c|t)',
        'z':'(c|g)a(a|g)',
        'j':'((at(a|c|t))|(tt(a|g))|(ct(a|c|g|t)))'
    };

    var sequence = state.get(['sequenceData', 'sequence']);
    // wrap around origin
    var sequenceExtended = sequence + sequence.slice(0, searchString.length-1);

    var match;
    var layers = [];

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

    var reverseSearchString = "";
    for (let i=0; i<searchString.length; i++) {
        if (dnaComplement[searchString[i]]) {
            reverseSearchString = dnaComplement[searchString[i]] + reverseSearchString;
        } else {
            reverseSearchString = searchString[i] + reverseSearchString;
        }
    }

    var reg = '('+searchString+')|('+reverseSearchString+')';
    try {
        var regex = new RegExp(reg, 'gi');
    } catch(e) {
        state.set('searchLayers', []);
        return;
    }
    do {
        match = regex.exec(sequenceExtended);
        if (match) {
            var end = match.index + match[0].length - 1;
            // wrap around origin
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
