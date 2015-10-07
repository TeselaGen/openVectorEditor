export default function wrapper(newInputPath, originalFunc) {
    return function(input, tree, output) {
        var modifiedInput = newInputPath ? input[newInputPath] : input;
        originalFunc(modifiedInput, tree, output)
    }
}