const handleMoves = {
  moveCaretLeftOne: function ({ isProtein, selectionLayer, shiftHeld }) {
    if (selectionLayer.start > -1 && !shiftHeld) {
      return 0;
    }
    return isProtein ? -3 : -1;
  },
  moveCaretRightOne: function ({ isProtein, selectionLayer, shiftHeld }) {
    if (selectionLayer.start > -1 && !shiftHeld) {
      return 0;
    }
    return isProtein ? 3 : 1;
  },
  moveCaretUpARow: function ({ bpsPerRow }) {
    return -bpsPerRow;
  },
  moveCaretDownARow: function ({ bpsPerRow }) {
    return bpsPerRow;
  },
  moveCaretToEndOfRow: function ({ bpsPerRow, caretPosition }) {
    return bpsPerRow - (caretPosition % bpsPerRow);
  },
  moveCaretToStartOfRow: function ({ bpsPerRow, caretPosition }) {
    let moveBy = -caretPosition % bpsPerRow;
    if (moveBy === 0) {
      moveBy = -bpsPerRow;
    }
    return moveBy;
  },
  moveCaretToStartOfSequence: function ({ caretPosition }) {
    return -caretPosition;
  },
  moveCaretToEndOfSequence: function ({ caretPosition, sequenceLength }) {
    return sequenceLength - caretPosition;
  }
};

function moveCaret({
  sequenceLength,
  bpsPerRow,
  caretPosition,
  selectionLayer,
  shiftHeld,
  isProtein,
  type
}) {
  const moveBy = handleMoves[type]({
    shiftHeld,
    sequenceLength,
    isProtein,
    bpsPerRow,
    caretPosition,
    selectionLayer
  });
  return moveBy;
}

export default moveCaret;
