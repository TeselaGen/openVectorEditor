var checkIfEditAllowed = require('./checkIfEditAllowed');
module.exports = function addEditModeOnly(actionArray) {
    return [
        checkIfEditAllowed, {
            editAllowed: actionArray,
            readOnly: [function({input, state, output}) {
                console.log('Unable to complete action while in Read Only mode')
            }]
        }
    ];
}