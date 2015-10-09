export default function getData({path, name}, tree, output) {
    output[name] = tree.get(path);
}