var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var normalizePositionByRangeLength = require('ve-range-utils/normalizePositionByRangeLength');
var ac = require('ve-api-check');
export default function handleCaretMoved({input: {
    moveBy, circular, sequenceLength, bpsPerRow, caretPosition, selectionLayer, shiftHeld, type
}, state, output}) {
    ac.throw(ac.number, caretPosition);
    ac.throw(ac.bool.optional, shiftHeld);
    ac.throw(ac.object, selectionLayer);
    ac.throw(ac.string, type);
    var newCaretPosition;
    if (selectionLayer.selected) {
        if (shiftHeld) {
            newCaretPosition = normalizeNewCaretPos(Number(caretPosition + moveBy), sequenceLength, circular);
            var anchorPos;
            if (selectionLayer.start <= selectionLayer.end) {
                //define an anchor pos
                //tnr: in progress
                if (selectionLayer.cursorAtEnd) {
                    if (newCaretPosition === selectionLayer.start && moveBy < 0) {
                        return output.caretMoved({
                            caretPosition: newCaretPosition
                        });
                    }
                    anchorPos = selectionLayer.start;
                } else {
                    if (newCaretPosition === selectionLayer.end + 1 && moveBy > 0) {
                        return output.caretMoved({
                            caretPosition: newCaretPosition
                        });
                    }
                    anchorPos = selectionLayer.end + 1;
                }
                if (newCaretPosition > anchorPos) {
                    output.selectionUpdated({
                        selectionLayer: {
                            start: anchorPos,
                            end: newCaretPosition - 1,
                            cursorAtEnd: true
                        }
                    });
                } else {
                    output.selectionUpdated({
                        selectionLayer: {
                            start: newCaretPosition,
                            end: anchorPos - 1,
                            cursorAtEnd: false
                        }
                    });
                }
            } else { //circular selection
                if (selectionLayer.cursorAtEnd) {
                    anchorPos = selectionLayer.start;
                } else {
                    anchorPos = selectionLayer.end + 1;
                }
                if (newCaretPosition <= anchorPos) {
                    output.selectionUpdated({
                        selectionLayer: {
                            start: anchorPos,
                            end: newCaretPosition - 1,
                            cursorAtEnd: true
                        }
                    });
                } else {
                    output.selectionUpdated({
                        selectionLayer: {
                            start: newCaretPosition,
                            end: anchorPos - 1,
                            cursorAtEnd: false
                        }
                    });
                }

            }
        } else { //no shiftHeld
            //handle special cases
            if (moveBy === 0) {
                if (type === 'moveCaretRightOne') {
                    return output.caretMoved({
                        caretPosition: selectionLayer.end + 1
                    });
                } else if (type === 'moveCaretLeftOne') {
                    return output.caretMoved({
                        caretPosition: selectionLayer.start
                    });
                } else {
                    throw new Error('this case should not be hit...')
                }
            } else if (moveBy > 0) {
                newCaretPosition = normalizeNewCaretPos(Number(selectionLayer.end + moveBy), sequenceLength, circular);
                output.caretMoved({
                    caretPosition: newCaretPosition + 1
                });
            } else {
                newCaretPosition = normalizeNewCaretPos(Number(selectionLayer.start + moveBy), sequenceLength, circular);
                output.caretMoved({
                    caretPosition: newCaretPosition
                });
            }
        }
    } else { //no selection layer
        newCaretPosition = normalizeNewCaretPos(Number(caretPosition + moveBy), sequenceLength, circular);
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
            } else { //moving to the left
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
        } else { //no shiftHeld
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