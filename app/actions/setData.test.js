// //import tap from 'tap';
// //tap.mochaGlobals();

// import setCaretPosition from '../../app/actions/setCaretPosition';
// import tree from '../../app/baobabTree.js';
// import assert from 'assert';
// describe('setCaretPosition', function () {
//     it ('changes the caret position from its initial value', function () {
//         assert.notEqual(55,tree.get('caretPosition'));
//         setCaretPosition(55);
//         assert.equal(55,tree.get('caretPosition'));
//         setCaretPosition(59);
//         assert.equal(59,tree.get('caretPosition'));
//     });
//     it ('changes the caret position to -1 if passed anything but a non-negative integer', function () {
//         assert.notEqual(-1,tree.get('caretPosition'));
//         setCaretPosition(false);
//         assert.equal(-1,tree.get('caretPosition'));
//     });
// });
