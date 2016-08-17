module.exports = function showSelectedEnzymeList({input: {selectedList}, state, output}) {
    var enzymesList = [];
    for (let i = 0; i < selectedList.length; i++) {
        enzymesList.push({
            name: selectedList[i],

        });
    }
    state.set('currentEnzymesList', enzymesList);
}