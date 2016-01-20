export default function checkShiftHeld({input, state, output}) {
    var shiftHeld = state.get('shiftHeld');

    if (shiftHeld) {
        output.shiftHeld();
    } else {
        output.shiftNotHeld();
    }
}

checkShiftHeld.outputs = ['shiftHeld', 'shiftNotHeld'];