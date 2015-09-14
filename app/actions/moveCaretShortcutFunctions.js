var tree = require('../baobabTree');
var moveCaret = require('./moveCaret');
var moveCaretShiftHeld = require('./moveCaretShiftHeld');

const moveCaretShortcutFunctions = {
    moveCaretLeftOne() {
            moveCaret(-1);
        },
        moveCaretRightOne() {
            moveCaret(1);
        },
        moveCaretUpARow() {
            var bpsPerRow = tree.get(['bpsPerRow']);
            moveCaret(-bpsPerRow);
        },
        moveCaretDownARow() {
            var bpsPerRow = tree.get(['bpsPerRow']);
            moveCaret(bpsPerRow);
        },
        moveCaretLeftOneShiftHeld() {
            moveCaretShiftHeld(-1);
        },
        moveCaretRightOneShiftHeld() {
            moveCaretShiftHeld(1);
        },
        moveCaretUpARowShiftHeld() {
            var bpsPerRow = tree.get(['bpsPerRow']);
            moveCaretShiftHeld(-bpsPerRow);
        },
        moveCaretDownARowShiftHeld() {
            var bpsPerRow = tree.get(['bpsPerRow']);
            moveCaretShiftHeld(bpsPerRow);
        },
};
export default moveCaretShortcutFunctions;