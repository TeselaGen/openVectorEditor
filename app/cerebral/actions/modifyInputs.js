export default function changeOutput(oldPath, newPath) {
    return function({input, state, output}) {
        output[newPath] = input[oldPath]
    }
}