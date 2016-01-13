// import set from 'cerebral-addons/set';

// var checkShiftHeld = require('./checkShiftHeld');
// var controller = require('../controller')({
//     //instantiate some default val's here:
//     // state: {
//     //     shiftHeld: true
//     // }
// });

// describe('checkShiftHeld', function() {
//     it('should call success when shiftHeld = true', function(done) {
//         set(['shiftHeld'], true), [
//         checkShiftHeld({}, controller.tree, {
//             shiftHeld: function() {
//                 done()
//             },
//             shiftNotHeld: function() {
//                 throw new Error();
//             }
//         })];
//     });
//     // controller.reset();
//     // controller.tree.set('shiftHeld', false);
//     it('should call error when shiftHeld = false', function(done) {
//         set(['shiftHeld'], false), [        
//         checkShiftHeld({}, controller.tree, {
//             shiftHeld: function() {
//                 throw new Error();
//             },
//             shiftNotHeld: function() {
//                 done()
//             }
//         })];
//     });

// });