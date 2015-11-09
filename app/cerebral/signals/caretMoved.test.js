var controller = require('../controller')({
    //instantiate some default val's here:
    state: {
        selectionLayer: {
            selected: false,
        },
        caretPosition: 1,
        sequenceData: {sequence: 'atat'},
        bpsPerRow: 2 //override the usual calc here
    }
});

var testSetup = require('./testSetup');

describe('caretMoved', function() {
    beforeEach(function() {
        controller.recorder.start();
    })
    afterEach(function (argument) {
        controller.recorder.reset()
    })
    it('should highlight when nothing is previously selected', function(done) {
        testSetup(controller, controller.signals.caretMoved, {
            type: 'moveCaretLeftOne',
            shiftHeld: false,
        }, function() {
            controller.get('caretPosition').should.equal(0);
            done()
        })
    });
});