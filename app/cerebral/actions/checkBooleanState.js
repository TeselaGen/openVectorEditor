var ac = require('ve-api-check/apiCheck');
module.exports = function checkBooleanState(path) {
    function stateCheck(input, tree, output) {
        var boolean = tree.get(path);
        ac.throw(ac.bool,boolean)
        if (boolean) {
            output.success()
        } else {
            output.error()
        }
    }
    stateCheck.displayName = 'checkBooleanState' + path.toString();
    return stateCheck;
}