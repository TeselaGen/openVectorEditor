module.exports = function editUserEnzymes({input: {currentUserList, currentEnzymesList, enzyme, action}, state, output}) {
    var editedList = currentUserList.slice();
    if (action === "remove") {
        var index = editedList.indexOf(enzyme);
        if (index >= 0) {
            editedList.splice(index, 1);
        }
    } else if (action === "add") {
        if (editedList.indexOf(enzyme) < 0) {
            editedList.push(enzyme);
            editedList.sort();
        }
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