export default function checkShiftHeld({ shiftHeld }, tree, output) {
    if (shiftHeld) {
        output.success();
    } else {
        output.error()
    }
}