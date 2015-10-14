export default function getData() {
    // if (!Array.isArray(paths)) {
    //     paths = [paths]
    // }
    var paths = Array.prototype.slice.call(arguments);
    var getData = function({}, tree, output) {
        var data = {};
        paths.forEach(function(path) {
            var info = tree.get(path);
            if (info === undefined) {
                throw new Error ('tnr: this probably should not be coming back as undefined, make sure you are passing in the arguments as individual strings')
            }
            data[path] = tree.get(path);
        });
        output(data);
    }
    getData.displayName = 'get-' + paths.join('-');
    return getData;
}