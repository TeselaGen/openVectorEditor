module.exports = function editUserEnzymes({input: {currentUserList, enzyme, action}, state, output}) {
    // console.log("Before: " + currentUserList);
    var editedList = currentUserList.slice();
    if (action === "remove") {
        var index = editedList.indexOf(enzyme);
        editedList.splice(index, 1);
    } else if (action === "add") {
        editedList.push(enzyme);
        editedList.sort();
    }
    state.set('currentUserEnzymesList', editedList);
    // console.log("After: " + state.get('currentUserEnzymesList'));
}