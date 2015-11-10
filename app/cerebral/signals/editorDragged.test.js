var controller = require('../controller')({
    //instantiate some default val's here:
    state: {
        selectionLayer: {
            selected: false,
        },
        caretPosition: 1,
        sequenceData: {
            sequence: 'atat',
            circular: true
        },
        //seq looks like:
        //at
        //at
    }
});

var testSignal = require('./testSignal');

describe('editorDragged circular sequence', function() {
    beforeEach(function () {
        controller.tree.set(['sequenceData', 'circular'], true);
    })
    it('moveCaretLeftOne should move the cursor left 1', function(done) {
        testSignal(controller, controller.signals.editorDragged, {
            type: 'moveCaretLeftOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(0);
            done()
        })
    });
    it('moveCaretLeftOne should move the cursor left 1 and around the sequence', function(done) {
        controller.tree.set('caretPosition', 0);
        testSignal(controller, controller.signals.editorDragged, {
            type: 'moveCaretLeftOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(3);
            done()
        })
    });
    
    it('moveCaretRightOne should move the cursor right 1', function(done) {
        controller.tree.set('caretPosition', 1);
        testSignal(controller, controller.signals.editorDragged, {
            type: 'moveCaretRightOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(2);
            done()
        })
    });
    it('moveCaretRightOne should move the cursor right 1 and around the sequence', function(done) {
        controller.tree.set('caretPosition', 4);
        testSignal(controller, controller.signals.editorDragged, {
            type: 'moveCaretRightOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(1);
            done()
        })
    });
    it('moveCaretUpARow should move the cursor up 2 places', function(done) {
        controller.tree.set('caretPosition', 4);
        testSignal(controller, controller.signals.editorDragged, {
            type: 'moveCaretUpARow',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(2);
            done()
        })
    });
    it('moveCaretUpARow should move the cursor up 2 places and around the sequence', function(done) {
        controller.tree.set('caretPosition', 0);
        testSignal(controller, controller.signals.editorDragged, {
            type: 'moveCaretUpARow',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(2);
            done()
        })
    });
});