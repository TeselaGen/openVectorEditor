/* eslint-disable no-var */
const EditCaretPositioning = {};

export default EditCaretPositioning;

if (window.getSelection && document.createRange) {
  //saves caret position(s)
  EditCaretPositioning.saveSelection = function (containerEl) {
    var range = window.getSelection().getRangeAt(0);
    var preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(containerEl);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    var start = preSelectionRange.toString().length;

    return {
      start: start,
      end: start + range.toString().length
    };
  };
  //restores caret position(s)
  EditCaretPositioning.restoreSelection = function (containerEl, savedSel) {
    var charIndex = 0,
      range = document.createRange();
    range.setStart(containerEl, 0);
    range.collapse(true);
    var nodeStack = [containerEl],
      node,
      foundStart = false,
      stop = false;

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType === 3) {
        var nextCharIndex = charIndex + node.length;
        if (
          !foundStart &&
          savedSel.start >= charIndex &&
          savedSel.start <= nextCharIndex
        ) {
          range.setStart(node, savedSel.start - charIndex);
          foundStart = true;
        }
        if (
          foundStart &&
          savedSel.end >= charIndex &&
          savedSel.end <= nextCharIndex
        ) {
          range.setEnd(node, savedSel.end - charIndex);
          stop = true;
        }
        charIndex = nextCharIndex;
      } else {
        var i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };
} else if (document.selection && document.body.createTextRange) {
  //saves caret position(s)
  EditCaretPositioning.saveSelection = function (containerEl) {
    var selectedTextRange = document.selection.createRange();
    var preSelectionTextRange = document.body.createTextRange();
    preSelectionTextRange.moveToElementText(containerEl);
    preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
    var start = preSelectionTextRange.text.length;

    return {
      start: start,
      end: start + selectedTextRange.text.length
    };
  };
  //restores caret position(s)
  EditCaretPositioning.restoreSelection = function (containerEl, savedSel) {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(containerEl);
    textRange.collapse(true);
    textRange.moveEnd("character", savedSel.end);
    textRange.moveStart("character", savedSel.start);
    textRange.select();
  };
}

// getCaretPosition: return [start, end] as offsets to elem.textContent that
//   correspond to the selected portion of text
//   (if start == end, caret is at given position and no text is selected)

// export function getCaretPosition(elem) {
//   const sel = window.getSelection();
//   let cum_length = [0, 0];

//   if (sel.anchorNode == elem) cum_length = [sel.anchorOffset, sel.extentOffset];
//   else {
//     const nodes_to_find = [sel.anchorNode, sel.extentNode];
//     if (!elem.contains(sel.anchorNode) || !elem.contains(sel.extentNode))
//       return undefined;
//     else {
//       const found = [0, 0];
//       let i;
//       node_walk(elem, function (node) {
//         for (i = 0; i < 2; i++) {
//           if (node == nodes_to_find[i]) {
//             found[i] = true;
//             if (found[i == 0 ? 1 : 0]) return false; // all done
//           }
//         }

//         if (node.textContent && !node.firstChild) {
//           for (i = 0; i < 2; i++) {
//             if (!found[i]) cum_length[i] += node.textContent.length;
//           }
//         }
//       });
//       cum_length[0] += sel.anchorOffset;
//       cum_length[1] += sel.extentOffset;
//     }
//   }
//   if (cum_length[0] <= cum_length[1]) return cum_length;
//   return [cum_length[1], cum_length[0]];
// }

// no operation
const noop = () => null;

/**
 * @function
 * @description
 * @param  {DOMElement} container The container in which the cursor position must be saved
 * @return {Function}             A function used to restore caret position
 */
export function selectionSaveCaretPosition(container) {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return noop;
  }

  const range = selection.getRangeAt(0);
  const clone = range.cloneRange();

  // find the range start index
  clone.selectNodeContents(container);
  clone.setStart(container, 0);
  clone.setEnd(range.startContainer, range.startOffset);
  const startIndex = clone.toString().length;

  // find the range end index
  clone.selectNodeContents(container);
  clone.setStart(container, 0);
  clone.setEnd(range.endContainer, range.endOffset);
  const endIndex = clone.toString().length;

  return function restoreCaretPosition() {
    const start = getTextNodeAtPosition(container, startIndex);
    const end = getTextNodeAtPosition(container, endIndex);
    const newRange = new Range();

    newRange.setStart(start.node, start.position);
    newRange.setEnd(end.node, end.position);

    selection.removeAllRanges();
    selection.addRange(newRange);
    container.focus();
  };
}

/**
 * @function
 * @description This function is used to determine the text node and it's index within
 * a "root" DOM element.
 *
 * @param  {DOMElement} rootEl The root
 * @param  {Integer} index     The index within the root element of which you want to find the text node
 * @return {Object}            An object that contains the text node, and the index within that text node
 */
function getTextNodeAtPosition(rootEl, index) {
  const treeWalker = document.createTreeWalker(
    rootEl,
    NodeFilter.SHOW_TEXT,
    function next(elem) {
      if (index > elem.textContent.length) {
        index -= elem.textContent.length;
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  );
  const node = treeWalker.nextNode();

  return {
    node: node ? node : rootEl,
    position: node ? index : 0
  };
}

// node_walk: walk the element tree, stop when func(node) returns false
// function node_walk(node, func) {
//   let result = func(node);
//   for (
//     node = node.firstChild;
//     result !== false && node;
//     node = node.nextSibling
//   )
//     result = node_walk(node, func);
//   return result;
// }

// const charpos = getCaretPosition(inputRef.current);

// let isChangeCloserToEnd;
// if (charpos && charpos[0]) {
//   if (charpos[0] > newVal.length - charpos[0]) {
//     isChangeCloserToEnd = true;
//   }
// }
// if (forward && !isChangeCloserToEnd) {
//   if (end || end === 0) {
//     change(
//       "start",
//       normalizePositionByRangeLength(end - textLength + 1, seqLen)
//     );
//   }
// } else {
//   if (start || start === 0) {
//     change(
//       "end",
//       normalizePositionByRangeLength(start + textLength - 1, seqLen)
//     );
//   }
// }
