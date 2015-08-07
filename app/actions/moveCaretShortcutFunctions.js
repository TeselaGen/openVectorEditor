var tree = require('../baobabTree');
var moveCaret = require('./moveCaret');
var moveCaretShiftHeld = require('./moveCaretShiftHeld');

module.exports = moveCaretShortcutFunctions = {
    moveCaretLeftOne: function() {
        moveCaret(-1);
    },
    moveCaretRightOne: function() {
        moveCaret(1);
    },
    moveCaretUpARow: function() {
        var bpsPerRow = tree.get(['$bpsPerRow']);
        moveCaret(-bpsPerRow);
    },
    moveCaretDownARow: function() {
        var bpsPerRow = tree.get(['$bpsPerRow']);
        moveCaret(bpsPerRow);
    },
    moveCaretLeftOneShiftHeld: function() {
        moveCaretShiftHeld(-1);
    },
    moveCaretRightOneShiftHeld: function() {
        moveCaretShiftHeld(1);
    },
    moveCaretUpARowShiftHeld: function() {
        var bpsPerRow = tree.get(['$bpsPerRow']);
        moveCaretShiftHeld(-bpsPerRow);
    },
    moveCaretDownARowShiftHeld: function() {
        var bpsPerRow = tree.get(['$bpsPerRow']);
        moveCaretShiftHeld(bpsPerRow);
    },
};