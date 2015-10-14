require('../../test/testSetup.js');
var updateCaretPosByMoveType = require('./updateCaretPosByMoveType.js');

var sequenceLength = 10;
var bpsPerRow = 5;
var caretPosition = 5;
var newCaretPosition = 7;
var selectionLayer = {
    start: 4,
    end: 3,
    selected: true,
    cursorAtEnd: true
};
var shiftHeld = false;
describe('updateCaretPosByMoveType correctly updates the caret position', function() {
    it('moveCaretLeftOne', function(done) {
        var type = 'moveCaretLeftOne';
        updateCaretPosByMoveType({
            sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type
        }, {}, function({updatedCaretPos}) {
            updatedCaretPos.should.equal(4)
            done()
        })
    });
    it('moveCaretLeftOne at start of seq', function(done) {
        var type = 'moveCaretLeftOne';
        updateCaretPosByMoveType({
            sequenceLength, bpsPerRow, caretPosition: 0, newCaretPosition, selectionLayer, shiftHeld, type
        }, {}, function({updatedCaretPos}) {
            updatedCaretPos.should.equal(0)
            done()
        })
    });
    it('moveCaretRightOne', function(done) {
        var type = 'moveCaretRightOne';
        updateCaretPosByMoveType({
            sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type
        }, {}, function({updatedCaretPos}) {
            updatedCaretPos.should.equal(6)
            done()
        })
    });
    it('moveCaretRightOne at end of seq', function(done) {
        var type = 'moveCaretRightOne';
        updateCaretPosByMoveType({
            sequenceLength, bpsPerRow, caretPosition: 10, newCaretPosition, selectionLayer, shiftHeld, type
        }, {}, function({updatedCaretPos}) {
            updatedCaretPos.should.equal(0)
            done()
        })
    });
    it('moveCaretUpARow', function(done) {
        var type = 'moveCaretUpARow';
        updateCaretPosByMoveType({
            sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type
        }, {}, function({updatedCaretPos}) {
            updatedCaretPos.should.equal(6)
            done()
        })
    });
    it('moveCaretUpARow at end of seq', function(done) {
        var type = 'moveCaretUpARow';
        updateCaretPosByMoveType({
            sequenceLength, bpsPerRow, caretPosition: 11, newCaretPosition, selectionLayer, shiftHeld, type
        }, {}, function({updatedCaretPos}) {
            updatedCaretPos.should.equal(11)
            done()
        })
    });

    // 'editorClick'
    // 'moveCaretLeftOne'
    // 'moveCaretUpARow'
    // 'moveCaretUpARow'
    // 'moveCaretDownARow'
    // 'moveCaretToEndOfRow'
    // 'moveCaretToStartOfRow'
    // 'moveCaretToStartOfSequence'
    // 'moveCaretToEndOfSequence'

});