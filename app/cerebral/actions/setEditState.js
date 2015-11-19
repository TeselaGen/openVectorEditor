export default function setEditState(input, tree, output) {
    // 
    // console.log("setting read only to " + input);
    // tree.set('readOnly', input);
    if(input) {
        tree.set('readOnly', true);
    } else {
        tree.set('readOnly', false);
    }
    console.log("readOnly: " + tree.get('readOnly'));
}