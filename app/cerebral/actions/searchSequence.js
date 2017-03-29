function searchSequence({input: { searchString, dna, literal }, state, output}) {
    searchString = searchString.toLowerCase();
    state.set('searchString', searchString)
    if (searchString.length === 0) {
        output({ searchLayers: [] });
        return;
    }

    // clear any selected layer
    state.set('selectionLayer', {
        start: -1,
        end: -1,
        id: -1,
        selected: false,
        cursorAtEnd: true
    });

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

    // var aminoAcids = {
    //     'ala':'gc(a|c|g|t)',
    //     'arg':'(cg(a|c|g|t))|(ag(a|g))',
    //     'asn':'aa(c|t)',
    //     'asp':'ga(c|t)',
    //     'cys':'tg(c|t)',
    //     'gln':'ca(a|g)',
    //     'glu':'ga(a|g)',
    //     'gly':'gg(a|c|g|t)',
    //     'his':'ca(c|t)',
    //     'ile':'at(a|c|t)',
    //     'leu':'(tt(a|g))|(ct(a|c|g|t))',
    //     'lys':'aa(a|g)',
    //     'met':'atg',
    //     'phe':'tt(c|t)',
    //     'pro':'cc(a|c|g|t)',
    //     's':'(ta(a|g))|(tga)',
    //     'ser':'(tc(a|c|g|t))|(ag(c|t))',
    //     'thr':'ac(a|c|g|t)',
    //     'trp':'tgg',
    //     'tyr':'ta(c|t)',
    //     'val':'gt(a|c|g|t)'
    // };

    var sequence = state.get(['sequenceData', 'sequence']);

    // wrap around origin
    var sequenceExtended = sequence + sequence.slice(0, searchString.length-1);

    var match;
    var layers = [];

    if (literal === "Ambiguous") {
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
    var regex = new RegExp(reg, 'gi');
    var bpsPerRow = state.get('bpsPerRow');
    do {
        match = regex.exec(sequenceExtended);
        if (match) {
            var end = match.index + match[0].length - 1;
            // wrap around origin
            if (end > sequence.length - 1) {
                end -= sequence.length;
            }
            var rows = [];
            var firstRow = Math.floor((match.index-1)/bpsPerRow);
            firstRow = firstRow < 0 ? 0 : firstRow;
            var lastRow = Math.floor(end/bpsPerRow);
            if (lastRow > firstRow) {
                for (let i=firstRow; i<=lastRow; i++) {
                    rows.push(i);
                }
            } else {
                for(let j=0; j<=lastRow; j++) {
                    rows.push(j);
                }
                var endRow = Math.floor(sequence.length/bpsPerRow);
                for (let k=firstRow; k<=endRow; k++) {
                    rows.push(k);
                }
            }

            layers.push({
                start: match.index,
                end: end,
                selected: true,
                cursorAtEnd: true,
                rows: rows
            });
        }
    } while (match);

    if (layers.length > 0) {
        state.set('searchLayers', layers);
    }

    output({ searchLayers: layers });
}

module.exports = searchSequence;
