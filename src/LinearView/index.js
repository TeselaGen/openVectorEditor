import draggableClassnames from "../constants/draggableClassnames";
import prepareRowData from "../utils/prepareRowData";
import React from "react";
import Draggable from "react-draggable";
import RowItem from "../RowItem";
import withEditorInteractions from "../withEditorInteractions";
import "./style.css";

let defaultMarginWidth = 10;

function noop() {}

export class LinearView extends React.Component {
  getNearestCursorPositionToMouseEvent(rowData, event, callback) {
    let rowNotFound = true;
    //loop through all the rendered rows to see if the click event lands in one of them
    let nearestCaretPos = 0;
    let rowDomNode = this.linearView;
    let boundingRowRect = rowDomNode.getBoundingClientRect();
    if (
      event.clientY > boundingRowRect.top &&
      event.clientY < boundingRowRect.top + boundingRowRect.height
    ) {
      //then the click is falls within this row
      rowNotFound = false;
      let row = rowData[0];
      if (event.clientX - boundingRowRect.left < 0) {
        nearestCaretPos = row.start;
      } else {
        let clickXPositionRelativeToRowContainer =
          event.clientX - boundingRowRect.left;
        let numberOfBPsInFromRowStart = Math.floor(
          (clickXPositionRelativeToRowContainer + this.charWidth / 2) /
            this.charWidth
        );
        nearestCaretPos = numberOfBPsInFromRowStart + row.start;
        if (nearestCaretPos > row.end + 1) {
          nearestCaretPos = row.end + 1;
        }
      }
    }

    if (rowNotFound) {
      nearestCaretPos = 0;
    }
    const callbackVals = {
      event,
      shiftHeld: event.shiftKey,
      nearestCaretPos,
      caretGrabbed: event.target.className === "cursor",
      selectionStartGrabbed: event.target.classList.contains(
        draggableClassnames.selectionStart
      ),
      selectionEndGrabbed: event.target.classList.contains(
        draggableClassnames.selectionEnd
      )
    };
    callback(callbackVals);
  }

  render() {
    let {
      //currently found in props
      sequenceData = {},
      alignmentData,
      hideName = false,
      editorDragged = noop,
      editorDragStarted = noop,
      editorClicked = noop,
      editorDragStopped = noop,
      width = 400,
      backgroundRightClicked = noop,
      RowItemProps = {},
      marginWidth = defaultMarginWidth,
      height,
      charWidth,
      linearViewAnnotationVisibilityOverrides,
      ...rest
    } = this.props;
    let innerWidth = Math.max(width - marginWidth, 0);
    this.charWidth = charWidth || innerWidth / sequenceData.sequence.length;
    let sequenceLength = sequenceData.sequence.length;
    const bpsPerRow = alignmentData
      ? alignmentData.sequence.length
      : sequenceLength;
    let sequenceName = hideName ? "" : sequenceData.name || "";
    let rowData = prepareRowData(sequenceData, sequenceLength);
    return (
      <div
        style={{
          height
        }}
      >
        <Draggable
          bounds={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onDrag={event => {
            this.getNearestCursorPositionToMouseEvent(
              rowData,
              event,
              editorDragged
            );
          }}
          onStart={event => {
            this.getNearestCursorPositionToMouseEvent(
              rowData,
              event,
              editorDragStarted
            );
          }}
          onStop={editorDragStopped}
        >
          <div
            ref={ref => (this.linearView = ref)}
            className="veLinearView"
            style={{
              width,
              marginLeft: marginWidth / 2
            }}
            onContextMenu={event => {
              this.getNearestCursorPositionToMouseEvent(
                rowData,
                event,
                backgroundRightClicked
              );
            }}
            onClick={event => {
              this.getNearestCursorPositionToMouseEvent(
                rowData,
                event,
                editorClicked
              );
            }}
          >
            {!hideName && (
              <SequenceName {...{ sequenceName, sequenceLength }} />
            )}
            <RowItem
              {...{
                ...rest,
                charWidth,
                alignmentData,
                sequenceLength: (alignmentData || sequenceData).sequence.length,
                width: innerWidth,
                bpsPerRow,
                tickSpacing: Math.floor(sequenceLength / 10),
                annotationVisibility: {
                  ...rest.annotationVisibility,
                  yellowAxis: true,
                  translations: true,
                  ...linearViewAnnotationVisibilityOverrides
                },
                ...RowItemProps
              }}
              row={rowData[0]}
            />
          </div>
        </Draggable>
      </div>
    );
  }
}

function SequenceName({ sequenceName, sequenceLength }) {
  return (
    <div key="circViewSvgCenterText" style={{ textAlign: "center" }}>
      <span>{sequenceName} </span>
      <br />
      <span>{sequenceLength + " bps"}</span>
    </div>
  );
}

export default withEditorInteractions(LinearView);
