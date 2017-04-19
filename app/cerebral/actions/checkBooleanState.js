module.exports = function checkBooleanState(path) {
    function stateCheck({input, state, output}) {
        var boolean = state.get(path);
        if (boolean) {
            output.success()
        } else {
            output.error()
        }
    }
    stateCheck.displayName = 'checkBooleanState: [' + path.toString() + ']';
    return stateCheck;
}
