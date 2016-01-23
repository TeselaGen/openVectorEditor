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

var testSignal = require('../testSignal');
var caretMoved = controller.getSignals().caretMoved;

describe('caretMoved circular sequence', function() {
    beforeEach(function() {
        controller.reset();
        controller.state.set(['sequenceData', 'circular'], true);
    })
    it.skip('moveCaretLeftOne should move the cursor left 1', function() {
        controller.state.set('caretPosition', 1);
        return testSignal(controller, caretMoved, {
            type: 'moveCaretLeftOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(0);
        })
    });
    it.skip('calling moveCaretLeftOne twice should move the cursor left 2 positions and around the sequence', function() {
        controller.state.set('caretPosition', 1);
        controller.get('caretPosition').should.equal(1)

        return testSignal(controller, caretMoved, {
            type: 'moveCaretLeftOne',
            shiftHeld: false,
        }).then(function() {
            return testSignal(controller, caretMoved, {
                type: 'moveCaretLeftOne',
                shiftHeld: false,
            }, function() {
                controller.get('caretPosition').should.equal(3);
            })
        })
    });

    it.skip('moveCaretRightOne should move the cursor right 1', function() {
        controller.state.set('caretPosition', 1);
        return testSignal(controller, caretMoved, {
            type: 'moveCaretRightOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(2);
        })
    });
    it.skip('moveCaretRightOne should move the cursor right 1 and around the sequence', function() {
        controller.state.set('caretPosition', 4);
        return testSignal(controller, caretMoved, {
            type: 'moveCaretRightOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(1);
        })
    });
    it.skip('moveCaretUpARow should move the cursor up 2 places', function() {
        controller.state.set('caretPosition', 4);
        return testSignal(controller, caretMoved, {
            type: 'moveCaretUpARow',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(2);
        })
    });
    it.skip('moveCaretUpARow should move the cursor up 2 places and around the sequence', function() {
        controller.state.set('caretPosition', 0);
        return testSignal(controller, caretMoved, {
            type: 'moveCaretUpARow',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(2);
        })
    });
});

describe('caretMoved non circular sequence', function() {
    beforeEach(function() {
        controller.state.set(['sequenceData', 'circular'], false);
    })
    it.skip('moveCaretLeftOne should not move the cursor around the sequence', function() {
        controller.state.set('caretPosition', 0);
        return testSignal(controller, caretMoved, {
            type: 'moveCaretLeftOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(0);
        })
    });

    it.skip('moveCaretRightOne should not move the cursor around the sequence', function() {
        controller.state.set('caretPosition', 4);
        return testSignal(controller, caretMoved, {
            type: 'moveCaretRightOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(4);
        })
    });

    it.skip('moveCaretUpARow should move the cursor up 2 places and around the sequence', function() {
        controller.state.set('caretPosition', 0);
        return testSignal(controller, caretMoved, {
            type: 'moveCaretUpARow',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(0);
        })
    });
});