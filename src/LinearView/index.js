import { isEqual } from "lodash";
import draggableClassnames from "../constants/draggableClassnames";
import prepareRowData from "../utils/prepareRowData";
import React from "react";
import Draggable from "react-draggable";
import RowItem from "../RowItem";
import withEditorInteractions from "../withEditorInteractions";
import { withEditorPropsNoRedux } from "../withEditorProps";
import "./style.css";
import { getEmptyText } from "../utils/editorUtils";

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
    if (this.props.sequenceData && this.props.sequenceData.isProtein) {
      nearestCaretPos = Math.round(nearestCaretPos / 3) * 3;
    }
    if (this.props.sequenceLength === 0) nearestCaretPos = 0;
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
    const { sequenceData = { sequence: "" }, alignmentData } = this.props;
    const data = alignmentData || sequenceData;
    return data.noSequence ? data.size : data.sequence.length;
  };

  getRowData = () => {
    const { sequenceData = { sequence: "" } } = this.props;
    if (!isEqual(sequenceData, this.oldSeqData)) {
      this.rowData = prepareRowData(
        {
          ...sequenceData,
          features: sequenceData.filteredFeatures || sequenceData.features
        },
        sequenceData.sequence ? sequenceData.sequence.length : 0
      );
      this.oldSeqData = sequenceData;
    }
    return this.rowData;
  };

  render() {
    let {
      //currently found in props
      sequenceData = { sequence: "" },
      alignmentData,
      hideName = false,
      editorDragged = noop,
      editorDragStarted = noop,
      editorClicked = noop,
      editorDragStopped = noop,
      width = 400,
      tickSpacing,
      caretPosition,
      backgroundRightClicked = noop,
      RowItemProps = {},
      marginWidth = defaultMarginWidth,
      height,
      charWidth,
      annotationVisibilityOverrides,
      isProtein,
      ...rest
    } = this.props;
    let innerWidth = Math.max(width - marginWidth, 0);
    this.charWidth = charWidth || innerWidth / this.getMaxLength();
    const bpsPerRow = this.getMaxLength();
    let sequenceName = hideName ? "" : sequenceData.name || "";
    let rowData = this.getRowData();

    return (
      <Draggable
        // enableUserSelectHack={false} //needed to prevent the input bubble from losing focus post user drag
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
            ...(height && { height }),
            paddingLeft: marginWidth / 2
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
                isProtein,
                sequenceName,
                sequenceLength: sequenceData.sequence
                  ? sequenceData.sequence.length
                  : 0
              }}
            />
          )}
          <RowItem
            {...{
              ...rest,
              charWidth,
              caretPosition,
              isProtein: sequenceData.isProtein,
              alignmentData,
              sequenceLength: this.getMaxLength(),
              width: innerWidth,
              bpsPerRow,
              emptyText: getEmptyText({ sequenceData, caretPosition }),
              tickSpacing:
                tickSpacing ||
                Math.floor(
                  this.getMaxLength() / (sequenceData.isProtein ? 9 : 10)
                ),
              annotationVisibility: {
                ...rest.annotationVisibility,
                // yellowAxis: true,
                translations: false,
                primaryProteinSequence: false,
                reverseSequence: false,
                sequence: false,
                cutsitesInSequence: false,
                ...annotationVisibilityOverrides
              },
              ...RowItemProps
            }}
            row={rowData[0]}
          />
        </div>
      </Draggable>
    );
  }
}

function SequenceName({ sequenceName, sequenceLength, isProtein }) {
  return (
    <div key="circViewSvgCenterText" style={{ textAlign: "center" }}>
      <span>{sequenceName} </span>
      <br />
      <span>
        {isProtein
          ? `${Math.floor(sequenceLength / 3)} AAs`
          : `${sequenceLength} bps`}
      </span>
    </div>
  );
}

export const NonReduxEnhancedLinearView = withEditorPropsNoRedux(LinearView);

export default withEditorInteractions(LinearView);
