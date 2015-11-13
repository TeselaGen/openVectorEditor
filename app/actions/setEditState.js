export default function setEditState(input, tree, output) {
    // 
    console.log("setting edit state to read only");
    console.log("readOnly: " + tree.get('readOnly'));
    tree.set('readOnly', true);
}

// setEditState.outputs = ['shiftHeld', 'shiftNotHeld'];