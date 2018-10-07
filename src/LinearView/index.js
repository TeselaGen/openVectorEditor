import { isEqual } from "lodash";
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
    //loop through all the rendered rows to see if the click event lands in one of them
    let nearestCaretPos = 0;
    let rowDomNode = this.linearView;
    let boundingRowRect = rowDomNode.getBoundingClientRect();
    const maxEnd = this.getMaxLength();
    if (event.clientX - boundingRowRect.left < 0) {
      nearestCaretPos = 0;
    } else {
      let clickXPositionRelativeToRowContainer =
        event.clientX - boundingRowRect.left;
      let numberOfBPsInFromRowStart = Math.floor(
        (clickXPositionRelativeToRowContainer + this.charWidth / 2) /
          this.charWidth
      );
      nearestCaretPos = numberOfBPsInFromRowStart + 0;
      if (nearestCaretPos > maxEnd + 1) {
        nearestCaretPos = maxEnd + 1;
      }
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
  getMaxLength = () => {
    const { sequenceData = {}, alignmentData } = this.props;
    return (alignmentData || sequenceData).sequence.length;
  };

  getRowData = () => {
    const { sequenceData = {} } = this.props;
    if (!isEqual(sequenceData, this.oldSeqData)) {
      this.rowData = prepareRowData(sequenceData, sequenceData.sequence.length);
      this.oldSeqData = sequenceData;
    }
    return this.rowData;
  };

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
      tickSpacing,
      backgroundRightClicked = noop,
      RowItemProps = {},
      marginWidth = defaultMarginWidth,
      height,
      charWidth,
      linearViewAnnotationVisibilityOverrides,
      ...rest
    } = this.props;
    let innerWidth = Math.max(width - marginWidth, 0);
    this.charWidth = charWidth || innerWidth / this.getMaxLength();
    const bpsPerRow = this.getMaxLength();
    let sequenceName = hideName ? "" : sequenceData.name || "";
    let rowData = this.getRowData();

    return (
      <div
        style={{
          height
        }}
      >
        <Draggable
          enableUserSelectHack={false} //needed to prevent the input bubble from losing focus post user drag
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
              <SequenceName
                {...{
                  sequenceName,
                  sequenceLength: sequenceData.sequence.length
                }}
              />
            )}
            <RowItem
              {...{
                ...rest,
                charWidth,
                alignmentData,
                sequenceLength: this.getMaxLength(),
                width: innerWidth,
                bpsPerRow,
                tickSpacing:
                  tickSpacing || Math.floor(this.getMaxLength() / 10),
                annotationVisibility: {
                  ...rest.annotationVisibility,
                  // yellowAxis: true,
                  translations: false,
                  reverseSequence: false,
                  sequence: false,
                  cutsitesInSequence: false,
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
