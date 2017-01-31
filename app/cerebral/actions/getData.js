export default function getData() {
    //takes in a path to data,
    //or an object with a path to the data and a desired name
    var paths = Array.prototype.slice.call(arguments);
    var getData = function({input: {}, state, output}) {
        var data = {};
        paths.forEach(function(path) {
            var info;
            if (path.path) {
                info = state.get(path.path);
                data[path.name] = info
            } else {
                info = state.get(path);
                data[path] = info
            }
            if (info === undefined) {
                throw new Error ('tnr: this probably should not be coming back as undefined, make sure you are passing in the correct arguments')
            }
        });
        output(data);
    }
    getData.displayName = 'get-' + paths.join('-');
    return getData;
}
