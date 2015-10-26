import checkShiftHeld from './checkShiftHeld';
describe('checkShiftHeld', function() {
    it('should call success when shiftHeld = true', function(done) {
        checkShiftHeld({
            shiftHeld: true
        }, {}, {
            shiftHeld: function() {
                done()
            },
            shiftNotHeld: function() {
                throw new Error();
            }
        });
    });
    it('should call error when shiftHeld = false', function(done) {
        checkShiftHeld({
            shiftHeld: false
        }, {}, {
            shiftHeld: function() {
                throw new Error();
            },
            shiftNotHeld: function() {
                done()
            }
        });
    });

});