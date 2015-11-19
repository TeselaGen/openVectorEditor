export default function setEditState(input, tree, output) {
    // 
    console.log("setting edit state to " + input);
    tree.set('readOnly', input);
    console.log("readOnly: " + tree.get('readOnly'));
}