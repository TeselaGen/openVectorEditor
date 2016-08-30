module.exports = function editUserEnzymes({input: {currentUserList, currentEnzymesList, enzyme, action, immediateUserListUpdate}, state, output}) {
    var editedList = currentUserList.slice();
    if (action === state.get('removeEnzymeButtonValue')) {
        var index = editedList.indexOf(enzyme);
        if (index >= 0) {
            editedList.splice(index, 1);
        }
    } else if (action === state.get('addEnzymeButtonValue')) {
        if (editedList.indexOf(enzyme) < 0) {
            editedList.push(enzyme);
            editedList.sort();
        }
    } else if (action === state.get('addAllEnzymesButtonValue')) {
        for (var i = 0; i < currentEnzymesList.length; i++) {
            if (editedList.indexOf(currentEnzymesList[i]) < 0) {
                editedList.push(currentEnzymesList[i]);
            }
        }
        editedList.sort();
    } else if (action === state.get('removeAllEnzymesButtonValue')) {
        editedList = [];
    }
    state.set('currentUserEnzymesList', editedList);
    if (immediateUserListUpdate) {
        state.set('userEnzymeList', editedList);
    }
}