module.exports = function editUserEnzymes({input: {currentUserList, enzyme, action}, state, output}) {
    console.log("Before: " + currentUserList);
    var editedList = currentUserList.slice();
    if (action === "delete") {
        var index = editedList.indexOf(enzyme);
        editedList.splice(index, 1);
        state.set('currentUserEnzymesList', editedList);
        console.log("After: " + state.get('currentUserEnzymesList'));
    }
}