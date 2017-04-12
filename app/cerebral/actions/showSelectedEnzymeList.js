module.exports = function showSelectedEnzymeList({input: {selectedList}, state, output}) {
    // ITS ALREADY AN ARRAYYYYYYY
    // console.log(selectedList);
    // var enzymesList = selectedList.slice();
    // console.log(enzymesList);
    state.set('currentEnzymesList', selectedList);
}