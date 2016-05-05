// var ac = require('ve-api-check');
var cutSequenceByRestrictionEnzyme = require('./cutSequenceByRestrictionEnzyme');

module.exports = function cutsitesFromSequence(sequence, circular, restrictionEnzymes) {
    //validate args!
    // ac.throw([
    //     ac.string,
    //     ac.bool,
    //     ac.array
    // ], arguments);

    var cutsitesByName = {};
    // var allCutsite= [];
    for (var i = 0; i < restrictionEnzymes.length; i++) {
        var re = restrictionEnzymes[i];
        var cutsites = cutSequenceByRestrictionEnzyme(sequence, circular, re);
        if (cutsites.length) {
            cutsitesByName[re.name] = cutsites;
        }
    }
    return cutsitesByName;
};