import { getRangeLength } from "ve-range-utils";
import React from "react";
import { divideBy3 } from "./proteinUtils";
import {
  getInsertBetweenVals,
  calculatePercentGC,
  getSequenceDataBetweenRange
} from "ve-sequence-utils";
import { sortBy } from "lodash";

export function getSelectionMessage({
  caretPosition = -1,
  selectionLayer = { start: -1, end: -1 },
  customTitle,
  sequenceLength,
  sequenceData,
  showGCContent,
  GCDecimalDigits,
  isProtein
}) {
  let isSelecting = selectionLayer.start > -1;
  if (isSelecting) {
    let length = getRangeLength(selectionLayer, sequenceLength);
    const GCContent = (numDecimalDigits = 0) =>
      calculatePercentGC(
        getSequenceDataBetweenRange(sequenceData, selectionLayer).sequence
      ).toFixed(numDecimalDigits);
    const seqLen = divideBy3(length, isProtein);
    return `${customTitle || "Selecting"} ${seqLen} ${(isProtein
      ? "AA"
      : "bp") + (seqLen === 1 ? "" : "s")} from ${divideBy3(
      selectionLayer.start,
      isProtein
    ) + 1} to ${divideBy3(selectionLayer.end + 1, isProtein)}${
      showGCContent && !isProtein ? ` (${GCContent(GCDecimalDigits)}% GC)` : ""
    }`;
  } else if (caretPosition > -1) {
    let insertBetween = getInsertBetweenVals(
      caretPosition,
      selectionLayer,
      sequenceLength
    );
    return (
      `Caret Between ` +
      (isProtein
        ? `AAs ${divideBy3(insertBetween[0], true)} and ${divideBy3(
            insertBetween[1] + 2,
            true
          )}`
        : `Bases ${insertBetween[0]} and ${insertBetween[1]}`)
    );
  } else {
    return "No Selection";
  }
}

export function preventDefaultStopPropagation(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
}

export function getNodeToRefocus(caretEl) {
  let nodeToReFocus;
  if (caretEl && caretEl.closest && caretEl.closest(".veVectorInteractionWrapper")) {
    nodeToReFocus = caretEl.closest(".veVectorInteractionWrapper");
  }
  return nodeToReFocus;
}

export function getEmptyText({ sequenceData, caretPosition }) {
  return sequenceData.sequence.length === 0 && caretPosition === -1 ? (
    <div className="veEmptySeqText">Insert Sequence Here</div>
  ) : null;
}

export function tryToRefocusEditor() {
  const ed = document.querySelector(".veVectorInteractionWrapper")
  ed && ed.focus()
}
export function mod(n, m) {
  return ((n % m) + m) % m;
}

export function pareDownAnnotations(annotations, max) {
  let annotationsToPass = annotations;
  let paredDown = false;
  if (Object.keys(annotations).length > max) {
    paredDown = true;
    let sortedAnnotations = sortBy(annotations, function(annotation) {
      return -getRangeLength(annotation);
    });
    annotationsToPass = sortedAnnotations
      .slice(0, max)
      .reduce(function(obj, item) {
        obj[item.id] = item;
        return obj;
      }, {});
  }
  return [annotationsToPass, paredDown];
}
