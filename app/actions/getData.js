export default function getData() {
    // if (!Array.isArray(paths)) {
    //     paths = [paths]
    // }
    var paths = Array.prototype.slice.call(arguments);
    var getData = function({}, tree, output) {
        var data = {};
        paths.forEach(function(path) {
            data[path] = tree.get(path);
        });
        output(data);
    }
    getData.displayName = 'get-' + paths.join('-');
    return getData;
}