require('../../testSetup.js');
var updateCaretPosByMoveType = require('./updateCaretPosByMoveType.js');

describe('updateCaretPosByMoveType', function() {
    it('inserts sequence sequence at start of sequence and adjusts annotations correctly', function() {
        var sequenceLength = 10;
        var bpsPerRow = 5;
        var caretPosition = 0;
        var newCaretPosition = 7;
        var selectionLayer = {start: 4, end: 3, selected: true, cursorAtEnd: true};
        var shiftHeld = false;
        var type = 'moveCaretLeftOne';
        
        updateCaretPosByMoveType ({sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type}, tree, output)
    });

//     'editorClick'
// 'moveCaretLeftOne'
// 'moveCaretRightOne'
// 'moveCaretUpARow'
// 'moveCaretDownARow'
// 'moveCaretToEndOfRow'
// 'moveCaretToStartOfRow'
// 'moveCaretToStartOfSequence'
// 'moveCaretToEndOfSequence'
    
});
