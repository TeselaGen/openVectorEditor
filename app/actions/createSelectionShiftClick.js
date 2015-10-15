export default function createSelectionShiftClick({
    updatedCaretPos, caretPosition
}, tree, output) {
    var ac = require('ve-api-check');
    ac.throw(ac.posInt, updatedCaretPos)
    ac.throw(ac.posInt, caretPosition)
    if (updatedCaretPos === caretPosition) {
        return output.doNothing()
    }
    if (updatedCaretPos > caretPosition) {
        output.updateSelection({
            selectionLayer: {
                start: caretPosition,
                end: updatedCaretPos - 1,
                cursorAtEnd: true,
                selected: true
            }
        })
    } else {
        output.updateSelection({
            selectionLayer: {
                start: updatedCaretPos,
                end: caretPosition - 1,
                cursorAtEnd: false,
                selected: true
            }
        })
    }
}
createSelectionShiftClick.outputs = ['updateSelection', 'doNothing'];