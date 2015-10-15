export default function checkShiftHeld({ shiftHeld }, tree, output) {
    if (shiftHeld) {
        output.shiftHeld();
    } else {
        output.shiftNotHeld();
    }
}

checkShiftHeld.outputs = ['shiftHeld', 'shiftNotHeld'];