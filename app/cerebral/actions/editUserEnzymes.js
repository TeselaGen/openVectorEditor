module.exports = function editUserEnzymes({input: {currentUserList, currentEnzymesList, enzyme, action}, state, output}) {
    var editedList = currentUserList.slice();
    var index = editedList.indexOf(enzyme);
    var alreadyPresent = (index >= 0);
    if ((action === "remove" || action === "toggle") && alreadyPresent) {
            editedList.splice(index, 1);
    } else if ((action === "add" || action === "toggle") && !alreadyPresent) {
        editedList.push(enzyme);
        editedList.sort();
    } else if (action === "add all") {
        for (var i = 0; i < currentEnzymesList.length; i++) {
            if (editedList.indexOf(currentEnzymesList[i]) < 0) {
                editedList.push(currentEnzymesList[i]);
            }
        }
        editedList.sort();
    } else if (action === "remove all") {
        editedList = [];
    }
    state.set('currentUserEnzymesList', editedList);
}