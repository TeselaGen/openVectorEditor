module.exports = function showSelectedEnzymeList({input: {selectedList}, state, output}) {
    var enzymesList = selectedList.slice();
    state.set('currentEnzymesList', enzymesList);
}