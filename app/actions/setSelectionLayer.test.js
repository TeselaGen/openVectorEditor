// // var tap = require('tap');
// // tap.mochaGlobals();

// var setSelectionLayer = require('../../app/actions/setSelectionLayer');
// var expect = require('chai').expect;
// var tree = require('../../app/baobabTree.js');

// describe('setSelectionLayer', function() {
//     it('clears the selection layer when called with false', function() {
//         //clear the selectionLayer
//         setSelectionLayer(false);
//         expect(tree.get('selectionLayer')).to.deep.equal({
//             start: -1,
//             end: -1,
//             selected: false,
//             cursorAtEnd: true
//         });
//     });
//     it('sets a selection layer and clears the cursor position when passed a valid range', function() {
//         //clear the selectionLayer
//         setSelectionLayer({start: 5, end: 6});
//         expect(tree.get('selectionLayer')).to.deep.equal({
//             start: 5,
//             end: 6,
//             selected: true,
//             cursorAtEnd: true
//         });
//         expect(tree.get('caretPosition')).to.deep.equal(-1);
//     });
// });