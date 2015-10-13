import '../../testSetup.js'
import updateSelShiftHeldAndPreviousSel from './updateSelShiftHeldAndPreviousSel.js'
describe('updateSelShiftHeldAndPreviousSel', function() {
    it('expands selection layer when possible, cursor at end', function(done) {
        //clear the selectionLayer
        updateSelShiftHeldAndPreviousSel({
            sequenceLength: 10,
            selectionLayer: {
                start: 5,
                end: 5,
                cursorAtEnd: true,
                selected: true
            },
            updatedCaretPos: 10
        }, {}, function({
            selectionLayer
        }) {
            selectionLayer.should.deep.equal({
                start: 5,
                end: 9,
                selected: true,
                cursorAtEnd: true
            });
            done()
        });
    });
    it('expands selection layer when possible, cursor at start', function(done) {
        //clear the selectionLayer
        updateSelShiftHeldAndPreviousSel({
            sequenceLength: 10,
            selectionLayer: {
                start: 5,
                end: 5,
                cursorAtEnd: false,
                selected: true
            },
            updatedCaretPos: 1
        }, {}, function({
            selectionLayer
        }) {
            selectionLayer.should.deep.equal({
                start: 1,
                end: 5,
                selected: true,
                cursorAtEnd: false
            });
            done()
        });
    });
    it('wraps selection layer when necessary, cursor at end', function(done) {
        //clear the selectionLayer
        updateSelShiftHeldAndPreviousSel({
            sequenceLength: 10,
            selectionLayer: {
                start: 5,
                end: 5,
                cursorAtEnd: false,
                selected: true
            },
            updatedCaretPos: 2
        }, {}, function({
            selectionLayer
        }) {
            selectionLayer.should.deep.equal({
                start: 5,
                end: 1,
                selected: true,
                cursorAtEnd: true
            });
            done()
        });
    });
    it('wraps selection layer when necessary, cursor at start', function(done) {
        //clear the selectionLayer
        updateSelShiftHeldAndPreviousSel({
            sequenceLength: 10,
            selectionLayer: {
                start: 5,
                end: 5,
                cursorAtEnd: false,
                selected: true
            },
            updatedCaretPos: 7
        }, {}, function({
            selectionLayer
        }) {
            selectionLayer.should.deep.equal({
                start: 7,
                end: 5,
                selected: true,
                cursorAtEnd: false
            });
            done()
        });
    });
});