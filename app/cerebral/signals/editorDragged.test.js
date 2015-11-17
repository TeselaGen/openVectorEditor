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

var testSignal = require('../testSignal');
describe('editorDragged circular sequence', function() {
    beforeEach(function() {
        controller.reset();
    });
    it('editorDrag starts by grabbing caret at pos 1 and moves to 2, 3, 1, 0', function() {
        return testSignal(controller, controller.signals.editorDragStarted, {nearestBP: 1, caretGrabbed: true})
        .then(function () {
            return testSignal(controller, controller.signals.editorDragged, {nearestBP: 2}, () => {
                controller.get('selectionLayer').start.should.equal(1);
                controller.get('selectionLayer').end.should.equal(1);
                controller.get('caretPosition').should.equal(2);
            });
        })
        .then(function () {
            return testSignal(controller, controller.signals.editorDragged, {nearestBP: 3}, () => {
                controller.get('selectionLayer').start.should.equal(1);
                controller.get('selectionLayer').end.should.equal(2);
                controller.get('caretPosition').should.equal(3);
            });
        })
        .then(function () {
            return testSignal(controller, controller.signals.editorDragged, {nearestBP: 1}, () => {
                controller.get('selectionLayer').selected.should.equal(false);
                controller.get('caretPosition').should.equal(1);
            });
        })
        .then(function () {
            return testSignal(controller, controller.signals.editorDragged, {nearestBP: 0}, () => {
                controller.get('selectionLayer').start.should.equal(1);
                controller.get('selectionLayer').end.should.equal(9);
                controller.get('caretPosition').should.equal(10);
            });
        })
    });
    it('editorDrag starts by grabbing caret at pos 1 and moves to 0, 1, 5', function() {
        return testSignal(controller, controller.signals.editorDragStarted, {nearestBP: 1, caretGrabbed: true})
        .then(function () {
            return testSignal(controller, controller.signals.editorDragged, {nearestBP: 0}, () => {
                controller.get('selectionLayer').start.should.equal(0);
                controller.get('selectionLayer').end.should.equal(0);
                controller.get('caretPosition').should.equal(10);
            });
        })
        .then(function () {
            return testSignal(controller, controller.signals.editorDragged, {nearestBP: 1}, () => {
                controller.get('selectionLayer').selected.should.equal(false);
                controller.get('caretPosition').should.equal(1);
            });
        })
        .then(function () {
            return testSignal(controller, controller.signals.editorDragged, {nearestBP: 5}, () => {
                controller.get('selectionLayer').start.should.equal(5);
                controller.get('selectionLayer').end.should.equal(1);
                controller.get('caretPosition').should.equal(5);
            });
        })
    });
});