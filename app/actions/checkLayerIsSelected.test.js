var checkShiftHeld = require('./checkShiftHeld');
describe('checkShiftHeld', function() {
    it('should call success when shiftHeld = true', function(done) {
        checkShiftHeld({
            shiftHeld: true
        }, {}, {
            success: function() {
                done()
            },
            error: function() {
                throw new Error();
            }
        });
    });
    it('should call error when shiftHeld = false', function(done) {
        checkShiftHeld({
            shiftHeld: false
        }, {}, {
            success: function() {
                throw new Error();
            },
            error: function() {
                done()
            }
        });
    });

});