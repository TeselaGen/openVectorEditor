export default function setData() {
    // if (!Array.isArray(paths)) {
    //     paths = [paths]
    // }
    var paths = Array.prototype.slice.call(arguments);
    var setData = function(input, tree, output) {
        paths.forEach(function(path) {
            input[path] = tree.set(path, input[path]);
        });
    }
    setData.displayName = 'set-' + paths.join('-');
    return setData;
}