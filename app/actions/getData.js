export default function getData(path) {
    return function({}, tree, output) {
        var data = {};
        data[path] = tree.get(path);
        output(data);
    }
}