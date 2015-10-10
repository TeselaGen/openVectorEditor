export default function checkLayerIsSelected({ shiftHeld }, tree, output) {
    if (shiftHeld) {
        output.success();
    } else {
        output.error()
    }
}