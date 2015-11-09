var controller = require('./controller')();

var testSetup = require('./testSetup');

describe('sequence dragging', function () {
  it('should highlight when nothing is previously selected', function (done) {
    testSetup(controller, controller.caretMoved, {type: 'moveCaretLeftOne'}, test)
  });
});
