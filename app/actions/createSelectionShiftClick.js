import ac from 've-api-check';

export default function createSelectionShiftClick({
    updatedCaretPos, caretPosition
}, tree, output) {
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
