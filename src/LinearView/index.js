import draggableClassnames from "../constants/draggableClassnames";
import React from "react";
import Draggable from "react-draggable";
import RowItem from "../RowItem";
import withEditorInteractions from "../withEditorInteractions";
import "./style.css";
import {
  getClientX,
  // getParedDownWarning,
} from "../utils/editorUtils";
import { SequenceName } from "./SequenceName";
import classNames from "classnames";
import { massageTickSpacing } from "../utils/massageTickSpacing";
import PinchHelper from "../helperComponents/PinchHelper/PinchHelper";

import { updateLabelsForInViewFeatures } from "../utils/updateLabelsForInViewFeatures";
import { VeTopRightContainer } from "../CircularView/VeTopRightContainer";
import { ZoomLinearView } from "./ZoomLinearView";
import {
  editorDragged,
  editorDragStarted,
  editorDragStopped
} from "../withEditorInteractions/clickAndDragUtils";
import { noop } from "lodash";

function getNearestCursorPositionToMouseEvent({
  ed,
  event,
  linearViewRef,
  callback
}) {
  //loop through all the rendered rows to see if the click event lands in one of them
  let nearestCaretPos = 0;
  let rowDomNode = linearViewRef;
  rowDomNode = rowDomNode.querySelector(".veRowItem");
  const boundingRowRect = rowDomNode.getBoundingClientRect();
  const maxEnd = ed.sequenceLength;
  if (getClientX(event) - boundingRowRect.left < 0) {
    nearestCaretPos = 0;
  } else {
    const clickXPositionRelativeToRowContainer =
      getClientX(event) - boundingRowRect.left;
    const numberOfBPsInFromRowStart = Math.floor(
      (clickXPositionRelativeToRowContainer + ed.charWidthLV / 2) /
        ed.charWidthLV
    );
    nearestCaretPos = numberOfBPsInFromRowStart + 0;
    if (nearestCaretPos > maxEnd + 1) {
      nearestCaretPos = maxEnd + 1;
    }
  }
  if (ed.isProtein) {
    nearestCaretPos = Math.round(nearestCaretPos / 3) * 3;
  }
  if (maxEnd === 0) nearestCaretPos = 0;
  const {
    updateSelectionOrCaret,
    caretPosition,
    selectionLayer,
    caretPositionUpdate,
    selectionLayerUpdate
  } = ed;
  const callbackVals = {
    updateSelectionOrCaret,
    caretPosition,
    selectionLayer,
    caretPositionUpdate,
    selectionLayerUpdate,
    sequenceLength: maxEnd,
    doNotWrapOrigin: !ed.circular,
    event,
    shiftHeld: event.shiftKey,
    nearestCaretPos,
    // caretGrabbed: event.target.className === "cursor",
    selectionStartGrabbed: event.target.classList.contains(
      draggableClassnames.selectionStart
    ),
    selectionEndGrabbed: event.target.classList.contains(
      draggableClassnames.selectionEnd
    )
  };
  callback(callbackVals);
}

export const LinearView = (props) => {
  const {
    ed,
    width,
    height,
    marginWidth,
    paddingBottom,
    backgroundRightClicked,
    editorClicked,
    annotationVisibilityOverrides,
    RowItemProps,
    ...rest
  } = props;

  let linearViewRef;

  const PinchHelperToUse = ed.linearZoomEnabled ? PinchHelper : React.Fragment;
  // const pinchHandler = {
  //   onPinch: ({ delta: [d] }) => {
  //     if (d === 0) return;
  //     bindOutsideChangeHelper.triggerChange(({ value, changeValue }) => {
  //       // changeValue(d);
  //       if (d > 0) {
  //         if (value > 8) {
  //           changeValue(value + 0.4);
  //         } else {
  //           changeValue(value + 0.2);
  //         }
  //       } else if (d < 0) {
  //         if (value > 8) {
  //           changeValue(value - 0.4);
  //         } else {
  //           changeValue(value - 0.2);
  //         }
  //       }
  //     });
  //     updateLabelsForInViewFeatures();
  //   }
  // };
  return (
    <Draggable
      enableUserSelectHack={false} //needed to prevent the input bubble from losing focus post user drag
      bounds={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDrag={(event) => {
        getNearestCursorPositionToMouseEvent({
          ed,
          event,
          linearViewRef,
          handler: props.editorDragged || editorDragged
        });
      }}
      onStart={(event) => {
        getNearestCursorPositionToMouseEvent({
          ed,
          event,
          linearViewRef,
          handler: props.editorDragStarted || editorDragStarted
        });
      }}
      onStop={props.editorDragStopped || editorDragStopped}
    >
      <div
        ref={(ref) => (linearViewRef = ref)}
        className={classNames("veLinearView", props.className, {
          isViewZoomedLV: ed.isViewZoomedLV
        })}
        style={{
          width,
          ...(height && { height }),
          paddingLeft: marginWidth / 2,
          ...(paddingBottom && { paddingBottom })
        }}
        onContextMenu={(event) => {
          getNearestCursorPositionToMouseEvent({
            ed,
            event,
            linearViewRef,
            handler: backgroundRightClicked
          });
        }}
        onClick={(event) => {
          getNearestCursorPositionToMouseEvent({
            ed,
            event,
            linearViewRef,
            handler: editorClicked
          });
        }}
      >
        {ed.linearZoomEnabled && ( //so this for conditonal rendering
          <ZoomLinearView
            ed={ed}
            afterOnChange={() => {
              updateLabelsForInViewFeatures();
            }}
          ></ZoomLinearView>
        )}
        {!ed.hideName && <SequenceName ed={ed} />}
        {/* {!ed.noWarnings && (
            <VeTopRightContainer>{getParedDownWarnings(ed)}</VeTopRightContainer>
          )} */}

        <PinchHelperToUse {...(ed.linearZoomEnabled && { onPinch: noop })}>
          {/* <PinchHelperToUse {...(ed.linearZoomEnabled && pinchHandler )}> */}
          <RowItem
            {...{
              ...rest,
              ed,
              onScroll: () => {
                updateLabelsForInViewFeatures();
              },
              rowContainerStyle: ed.isViewZoomedLV
                ? { paddingBottom: 15 }
                : undefined,
              charWidth: ed.charWidthLV,
              // scrollData,
              width: ed.innerWidthLV,
              bpsPerRow: ed.sequenceLength,
              tickSpacing:
                ed.tickSpacingLV ||
                (ed.isViewZoomedLV
                  ? massageTickSpacing(Math.ceil(120 / ed.charWidthLV))
                  : Math.floor(ed.sequenceLength / (ed.isProtein ? 9 : 10))),
              annotationVisibility: {
                ...ed.annotationVisibility,
                ...((!ed.isViewZoomedLV || ed.charWidthLV < 5) && {
                  translations: false,
                  primaryProteinSequence: false,
                  reverseSequence: false,
                  sequence: false,
                  cutsitesInSequence: false
                }),
                ...annotationVisibilityOverrides
              },
              ...RowItemProps
            }}
            row={ed.rowDataLV}
            isLinearView
          />
        </PinchHelperToUse>
      </div>
    </Draggable>
  );
};


export default withEditorInteractions(LinearView);

export const scrollToCaret = () => {
  const el = window.document.querySelector(".veLinearView .veRowViewCaret");
  if (!el) return;
  el.scrollIntoView({ inline: "center", block: "nearest" });
};
