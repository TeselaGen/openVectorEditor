// var moveCaret = require('./moveCaret');

// const checkMoveType = {
//         moveCaretLeftOne({shiftHeld}, tree, output) {
//             moveCaret({moveBy: -1, shiftHeld}, tree, output);
//         },
//         moveCaretRightOne({shiftHeld}, tree, output) {
//             moveCaret({moveBy: 1, shiftHeld}, tree, output);
//         },
//         moveCaretUpARow({shiftHeld}, tree, output) {
//             var bpsPerRow = tree.get(['bpsPerRow']);
//             moveCaret({moveBy: -bpsPerRow, shiftHeld}, tree, output);
//         },
//         moveCaretDownARow({shiftHeld}, tree, output) {
//             var bpsPerRow = tree.get(['bpsPerRow']);
//             moveCaret({moveBy: bpsPerRow, shiftHeld}, tree, output);
//         },
//         moveCaretToEndOfRow({shiftHeld}, tree, output) {
//             var bpsPerRow = tree.get(['bpsPerRow']);
//             var caretPosition = getCaretPosition(tree);
//             var moveBy = bpsPerRow - caretPosition % bpsPerRow;
//             moveCaret({moveBy: moveBy, shiftHeld}, tree, output);
//         },
//         moveCaretToStartOfRow({shiftHeld}, tree, output) {
//             var bpsPerRow = tree.get(['bpsPerRow']);
//             var caretPosition = getCaretPosition(tree);
//             var moveBy = -1 * caretPosition % bpsPerRow;
//             moveCaret({moveBy: moveBy, shiftHeld}, tree, output);
//         },
//         moveCaretToStartOfSequence({shiftHeld}, tree, output) {
//             var caretPosition = getCaretPosition(tree);
//             var moveBy = -1 * caretPosition;
//             moveCaret({moveBy: moveBy, shiftHeld}, tree, output);
//         },
//         moveCaretToEndOfSequence({shiftHeld}, tree, output) {
//             var caretPosition = getCaretPosition(tree);
//             var sequenceLength = tree.get('sequenceLength');
//             var moveBy = sequenceLength - caretPosition;
//             moveCaret({moveBy: moveBy, shiftHeld}, tree, output);
//         },
// };

// function getCaretPosition(tree) {
//     var caretPosition = tree.get(['caretPosition']);
//     if (caretPosition === -1) {
//         var selectionLayer = tree.get(['selectionLayer']);
//         if (selectionLayer.selected) {
//             if (selectionLayer.cursorAtEnd) {
//                 caretPosition = selectionLayer.end + 1;
//             } else {
//                 caretPosition = selectionLayer.start;
//             }
//         }
//     }
//     return caretPosition;
// }

// export default moveCaretShortcutFunctions;