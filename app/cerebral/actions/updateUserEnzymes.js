module.exports = function updateUserEnzymes({input: {selectedButton, currentUserList, originalUserList}, state, output}) {
    var actualList = [];
    if (selectedButton === state.get('applyButtonValue') || selectedButton === state.get('okButtonValue')) {
        actualList = currentUserList.slice();
        state.set('originalUserEnzymesList', actualList);
    } else if (selectedButton === state.get('cancelButtonValue')) {
        actualList = originalUserList.slice();
        state.set('currentUserEnzymesList', actualList);
    }
    state.set('userEnzymeList', actualList);
}