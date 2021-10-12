import { getRangeLength } from "ve-range-utils";
import React from "react";
import { divideBy3 } from "./proteinUtils";
import {
  getInsertBetweenVals,
  calculatePercentGC,
  getSequenceDataBetweenRange
} from "ve-sequence-utils";
import { get, sortBy } from "lodash";
import VeWarning from "../helperComponents/VeWarning";
import normalizePositionByRangeLength from "ve-range-utils";

export function getSelectionMessage({
  caretPosition = -1,
  selectionLayer = { start: -1, end: -1 },
  customTitle,
  sequenceLength,
  sequenceData,
  showGCContent, //these are only passed in for the status bar
  GCDecimalDigits, //these are only passed in for the status bar
  isProtein
}) {
  let _selectionLayer = selectionLayer;
  const isSelecting = selectionLayer.start > -1;
  if (isSelecting) {
    _selectionLayer = getSelFromWrappedAddon(selectionLayer, sequenceLength);
    const length = getRangeLength(_selectionLayer, sequenceLength);
    const GCContent = (numDecimalDigits = 0) =>
      calculatePercentGC(
        getSequenceDataBetweenRange(sequenceData, _selectionLayer).sequence
      ).toFixed(numDecimalDigits);
    const seqLen = divideBy3(length, isProtein);
    return `${customTitle || "Selecting"} ${seqLen} ${
      (isProtein ? "AA" : "bp") + (seqLen === 1 ? "" : "s")
    } from ${divideBy3(_selectionLayer.start, isProtein) + 1} to ${divideBy3(
      _selectionLayer.end + 1,
      isProtein
    )}${
      showGCContent && !isProtein ? ` (${GCContent(GCDecimalDigits)}% GC)` : ""
    }`;
  } else if (caretPosition > -1) {
    const insertBetween = getInsertBetweenVals(
      caretPosition,
      _selectionLayer,
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
  if (
    caretEl &&
    caretEl.closest &&
    caretEl.closest(".veVectorInteractionWrapper")
  ) {
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
  const ed = document.querySelector(".veVectorInteractionWrapper");
  ed && ed.focus();
}
export function getCustomEnzymes() {
  try {
    const customEnzymes = JSON.parse(
      window.localStorage.getItem("customEnzymes") || "{}"
    );
    return customEnzymes;
  } catch (error) {
    return {};
  }
}
export function addCustomEnzyme(newEnz) {
  const customEnzymes = getCustomEnzymes();
  window.localStorage.setItem(
    "customEnzymes",
    JSON.stringify({
      ...customEnzymes,
      [newEnz.name.toLowerCase()]: newEnz
    })
  );
}

export function pareDownAnnotations(annotations, max) {
  let annotationsToPass = annotations;
  let paredDown = false;
  if (Object.keys(annotations).length > max) {
    paredDown = true;
    const sortedAnnotations = sortBy(annotations, function (annotation) {
      return -getRangeLength(annotation);
    });
    annotationsToPass = sortedAnnotations
      .slice(0, max)
      .reduce(function (obj, item) {
        obj[item.id] = item;
        return obj;
      }, {});
  }
  return [annotationsToPass, paredDown];
}
export function getParedDownWarning({ nameUpper, maxToShow, isAdjustable }) {
  return (
    <VeWarning
      data-test={`ve-warning-max${nameUpper}ToDisplay`}
      tooltip={`Warning: More than ${maxToShow} ${
        nameUpper === "Cutsites" ? "Cut Sites" : nameUpper
      }. Only displaying ${maxToShow} ${
        isAdjustable ? "(Configure this under View > Limits)" : ""
      } `}
    />
  );
}

export function getClientX(event) {
  return event.clientX || get(event, "touches[0].clientX");
}
export function getClientY(event) {
  return event.clientY || get(event, "touches[0].clientY");
}

export function hideAnnByLengthFilter(hideOpts, ann, seqLen) {
  const featLength = getRangeLength(ann, seqLen);
  return (
    hideOpts.enabled && (featLength < hideOpts.min || featLength > hideOpts.max)
  );
}

export function getSelFromWrappedAddon(selectionLayer, sequenceLength) {
  const selToUse = {
    ...selectionLayer
  };
  if (selectionLayer.isWrappedAddon) {
    const oldEnd = selToUse.end;
    selToUse.end = normalizePositionByRangeLength(
      selToUse.start - 1,
      sequenceLength
    );
    selToUse.start = normalizePositionByRangeLength(oldEnd + 1, sequenceLength);
    delete selToUse.isWrappedAddon;
  }
  return selToUse;
}
