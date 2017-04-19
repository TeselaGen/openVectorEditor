module.exports = function updateUserEnzymes({input: {selectedButton, currentUserList, originalUserList}, state, output}) {
    var actualList = [];
    if (selectedButton === "Apply") {
        actualList = currentUserList.slice();
        state.set('originalUserEnzymesList', actualList);
    } else if (selectedButton === "Cancel") {
        actualList = originalUserList.slice();
        state.set('currentUserEnzymesList', actualList);
    }
    state.set('userEnzymeList', actualList);
}