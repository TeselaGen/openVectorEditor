import ac from 've-api-check';
import cutSequenceByRestrictionEnzyme from './cutSequenceByRestrictionEnzyme';

module.exports = function cutsitesFromSequence(sequence, circular, restrictionEnzymes) {
    //validate args!
    ac.throw([
        ac.string,
        ac.bool,
        ac.array
    ], arguments);

    var cutsitesByName = {};
    // var allCutsite= [];
    for (var i = 0; i < restrictionEnzymes.length; i++) {
        var re = restrictionEnzymes[i];
        cutsitesByName[re.name] = cutSequenceByRestrictionEnzyme(sequence, circular, re);
    }
    return cutsitesByName;
};