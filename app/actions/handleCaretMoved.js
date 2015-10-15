var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var normalizePositionByRangeLength = require('ve-range-utils/normalizePositionByRangeLength');
var ac = require('ve-api-check');
export default function handleCaretMoved({
    moveBy, circular, sequenceLength, bpsPerRow, caretPosition, selectionLayer, shiftHeld, type
}, tree, output) {
    ac.throw(ac.number, caretPosition);
    ac.throw(ac.bool.optional, shiftHeld);
    ac.throw(ac.object, selectionLayer);
    ac.throw(ac.string, type);
    var newCaretPosition = normalizeNewCaretPos(Number(caretPosition + moveBy), sequenceLength, circular);
    if (selectionLayer.selected) {
        if (shiftHeld) {
            if (selectionLayer.cursorAtEnd) {
                if (newCaretPosition === selectionLayer.start && moveBy < 0) {
                    output.caretMoved({
                        caretPosition: newCaretPosition
                    });
                } else {
                    output.selectionUpdated({
                        selectionLayer: {
                            start: selectionLayer.start,
                            end: newCaretPosition - 1,
                            cursorAtEnd: true
                        }
                    })
                }
            } else {
                if (newCaretPosition - 1 === selectionLayer.end && moveBy > 0) {
                    output.caretMoved({
                        caretPosition: newCaretPosition
                    });
                } else {
                    output.selectionUpdated({
                        selectionLayer: {
                            start: newCaretPosition,
                            end: selectionLayer.end,
                            cursorAtEnd: false
                        }
                    })
                }
            }
        } else {
            output.caretMoved({
                caretPosition: newCaretPosition
            });
        }
    } else {
        if (shiftHeld) {
            if (moveBy > 0) {
                if (newCaretPosition === caretPosition) {
                    output.caretMoved({
                        caretPosition: newCaretPosition
                    });
                } else {
                    output.selectionUpdated({
                        selectionLayer: {
                            start: caretPosition,
                            end: newCaretPosition - 1,
                            cursorAtEnd: true
                        }
                    })
                }
            } else {
                if (newCaretPosition === caretPosition) {
                    output.caretMoved({
                        caretPosition: newCaretPosition
                    });
                } else {
                    output.selectionUpdated({
                        selectionLayer: {
                            start: newCaretPosition,
                            end: caretPosition - 1,
                            cursorAtEnd: false
                        }
                    })
                }
            }
        } else {
            output.caretMoved({
                caretPosition: newCaretPosition
            });
        }
    }
}

handleCaretMoved.outputs = ['caretMoved', 'selectionUpdated'];

function normalizeNewCaretPos(caretPosition, sequenceLength, circular) {
    if (circular) {
        return normalizePositionByRangeLength(caretPosition, sequenceLength, true)
    } else {
        return trimNumberToFitWithin0ToAnotherNumber(caretPosition, sequenceLength)
    }
}