module.exports = function showGeneRuler({input: {selectedRuler}, state, output}) {
    var geneRuler = selectedRuler.slice();
    state.set('currentGeneRuler', geneRuler);
}