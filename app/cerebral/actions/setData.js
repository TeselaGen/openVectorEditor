export default function setData() {
    // if (!Array.isArray(paths)) {
    //     paths = [paths]
    // }
    var paths = Array.prototype.slice.call(arguments);
    var setData = function({input, state, output}) {
        paths.forEach(function(path) {
            input[path] = state.set(path, input[path]);
        });
    }
    setData.displayName = 'set-' + paths.join('-');
    return setData;
}