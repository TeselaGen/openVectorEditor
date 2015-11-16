var testSignal = require('../testSignal');
describe('editorDragged circular sequence', function() {
    it('editorDrag starts by grabbing caret at pos 1 and moves to 2', function(done) {
        var controller = require('../controller')({
            //instantiate some default val's here:
            state: {
                selectionLayer: {
                    selected: false,
                },
                caretPosition: 1,
                sequenceData: {
                    sequence: 'atatatatat',
                    circular: true
                },
            }
        });
        controller.signals.editorDragStarted({nearestBP: 1, caretGrabbed: true});
        testSignal(controller.signals.editorDragged, {
            nearestBP: 2,
        }, function() {
            controller.get('selectionLayer').start.should.equal(1);
            controller.get('selectionLayer').end.should.equal(1);
            controller.get('caretPosition').should.equal(2);
            done()
        })
        controller.signals.editorDragStopped();
    });
    it('editorDrag starts by grabbing caret at pos 1 and moves to 2 and then moves back to pos 1', function(done) {
        var controller = require('../controller')({
            //instantiate some default val's here:
            state: {
                selectionLayer: {
                    selected: false,
                },
                caretPosition: 1,
                sequenceData: {
                    sequence: 'atatatatat',
                    circular: true
                },
            }
        });
        controller.signals.editorDragStarted({nearestBP: 1, caretGrabbed: true});
        controller.signals.editorDragged({nearestBP: 2});
        testSignal(controller.signals.editorDragged, {
            nearestBP: 1,
        }, function() {
            controller.get('selectionLayer').selected.should.equal(false);
            controller.get('caretPosition').should.equal(1);
            done()
        })
        controller.signals.editorDragStopped();
    });
    it('editorDrag starts by grabbing caret at pos 1 and moves to 0', function(done) {
        var controller = require('../controller')({
            //instantiate some default val's here:
            state: {
                selectionLayer: {
                    selected: false,
                },
                caretPosition: 1,
                sequenceData: {
                    sequence: 'atatatatat',
                    circular: true
                },
            }
        });
        controller.signals.editorDragStarted({nearestBP: 1, caretGrabbed: true});
        testSignal(controller.signals.editorDragged, {
            nearestBP: 0,
        }, function() {
            controller.get('selectionLayer').start.should.equal(0);
            controller.get('selectionLayer').end.should.equal(0);
            controller.get('caretPosition').should.equal(0);
            done()
        })
        controller.signals.editorDragStopped();
    });
    it('editorDrag starts at pos 1 without grabbing caret and moves to 0', function(done) {
        var controller = require('../controller')({
            //instantiate some default val's here:
            state: {
                selectionLayer: {
                    selected: false,
                },
                caretPosition: 8,
                sequenceData: {
                    sequence: 'atatatatat',
                    circular: true
                },
            }
        });
        controller.signals.editorDragStarted({nearestBP: 1, caretGrabbed: false});
        testSignal(controller.signals.editorDragged, {
            nearestBP: 0,
        }, function() {
            controller.get('selectionLayer').start.should.equal(0);
            controller.get('selectionLayer').end.should.equal(0);
            controller.get('caretPosition').should.equal(0);
            done()
        })
        controller.signals.editorDragStopped();
    });
    it.skip('editorDrag starts by grabbing caret at pos 1 and moves around the sequence', function(done) {
        var controller = require('../controller')({
            //instantiate some default val's here:
            state: {
                selectionLayer: {
                    selected: false,
                },
                caretPosition: 1,
                sequenceData: {
                    sequence: 'atatatatat',
                    circular: true
                },
            }
        });
        controller.signals.editorDragStarted({nearestBP: 1, caretGrabbed: true});
        controller.signals.editorDragged({nearestBP: 0});
        testSignal(controller.signals.editorDragged, {
            nearestBP: 1,
        }, function() {
            controller.get('selectionLayer').start.should.equal(1);
            controller.get('selectionLayer').end.should.equal(1);
            controller.get('caretPosition').should.equal(0);
            done()
        })
        controller.signals.editorDragStopped();
    });
});