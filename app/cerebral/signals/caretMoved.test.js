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
        bpsPerRow: 2 //override the usual calc here
        //seq looks like:
        //at
        //at
    }
});

var testSignal = require('./testSignal');
var caretMoved = controller.signals.caretMoved;

describe('caretMoved circular sequence', function() {
    beforeEach(function () {
        controller.tree.set(['sequenceData', 'circular'], true);
    })
    it('moveCaretLeftOne should move the cursor left 1', function(done) {
        controller.tree.set('caretPosition', 1);
        testSignal(caretMoved, {
            type: 'moveCaretLeftOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(0);
            done()
        })
    });
    it('calling moveCaretLeftOne twice should move the cursor left 2 positions and around the sequence', function(done) {
        controller.tree.set('caretPosition', 1);
        controller.signals.caretMoved({
            type: 'moveCaretLeftOne',
            shiftHeld: false,
        });
        testSignal(caretMoved, {
            type: 'moveCaretLeftOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(3);
            done()
        })
    });
    
    it('moveCaretRightOne should move the cursor right 1', function(done) {
        controller.tree.set('caretPosition', 1);
        testSignal(caretMoved, {
            type: 'moveCaretRightOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(2);
            done()
        })
    });
    it('moveCaretRightOne should move the cursor right 1 and around the sequence', function(done) {
        controller.tree.set('caretPosition', 4);
        testSignal(caretMoved, {
            type: 'moveCaretRightOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(1);
            done()
        })
    });
    it('moveCaretUpARow should move the cursor up 2 places', function(done) {
        controller.tree.set('caretPosition', 4);
        testSignal(caretMoved, {
            type: 'moveCaretUpARow',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(2);
            done()
        })
    });
    it('moveCaretUpARow should move the cursor up 2 places and around the sequence', function(done) {
        controller.tree.set('caretPosition', 0);
        testSignal(caretMoved, {
            type: 'moveCaretUpARow',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(2);
            done()
        })
    });
});

describe('caretMoved non circular sequence', function() {
    beforeEach(function () {
        controller.tree.set(['sequenceData', 'circular'], false);
    })
    it('moveCaretLeftOne should not move the cursor around the sequence', function(done) {
        controller.tree.set('caretPosition', 0);
        testSignal(caretMoved, {
            type: 'moveCaretLeftOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(0);
            done()
        })
    });
    
    it('moveCaretRightOne should not move the cursor around the sequence', function(done) {
        controller.tree.set('caretPosition', 4);
        testSignal(caretMoved, {
            type: 'moveCaretRightOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(4);
            done()
        })
    });

    it('moveCaretUpARow should move the cursor up 2 places and around the sequence', function(done) {
        controller.tree.set('caretPosition', 0);
        testSignal(caretMoved, {
            type: 'moveCaretUpARow',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(0);
            done()
        })
    });
});