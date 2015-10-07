export default function changeOutput(oldPath, newPath) {
    return function(input, tree, output) {
    	output[newPath] = input[oldPath]
    }
}