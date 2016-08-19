module.exports = function updateUserEnzymes({input: {selectedButton, currentUserList, originalUserList}, state, output}) {
    // console.log("Before: original - " + originalUserList + "; current - " + currentUserList);
    // console.log("UserList: " + state.get('userEnzymeList'));
    var actualList = [];
    if (selectedButton === "OK") {
        actualList = currentUserList.slice();
        // console.log(actualList);
        state.set('originalUserEnzymesList', actualList);
    } else if (selectedButton === "Cancel") {
        actualList = originalUserList.slice();
        state.set('currentUserEnzymesList', actualList);
        // console.log(actualList);
    }
    state.set('userEnzymeList', actualList);
    // console.log("After: original - " + state.get('originalUserEnzymesList')+ "; current - " + state.get('currentUserEnzymesList'));
    // console.log("UserList: " + state.get('userEnzymeList'));
}