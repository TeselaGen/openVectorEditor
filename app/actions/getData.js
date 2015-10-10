export default function getData(path) {
    var getData = function({}, tree, output) {
        var data = {};
        data[path] = tree.get(path);
        output(data);
    }
    getData.displayName = 'get' + path;
    return getData;
}