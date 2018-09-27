import { isEqual } from "lodash";
import draggableClassnames from "../constants/draggableClassnames";
import prepareRowData from "../utils/prepareRowData";
import React from "react";
import Draggable from "react-draggable";
import RowItem from "../RowItem";
import withEditorInteractions from "../withEditorInteractions";
import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
import "./style.css";

let defaultMarginWidth = 10;

function noop() {}

export class LinearView extends React.Component {
  state = {
    charWidth: false
  };
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
      showZoomSlider,
      tickSpacing,
      backgroundRightClicked = noop,
      RowItemProps = {},
      marginWidth = defaultMarginWidth,
      height,
      charWidth,
      linearViewAnnotationVisibilityOverrides,
      ...rest
    } = this.props;

    const bpsPerRow = this.getMaxLength();
    let innerWidth = Math.max(
      this.state.charWidth ? charWidth * bpsPerRow : width - marginWidth,
      0
    );
    this.charWidth =
      charWidth || this.state.charWidth || innerWidth / this.getMaxLength();
    let sequenceName = hideName ? "" : sequenceData.name || "";
    let rowData = this.getRowData();

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
              overflowX: "scroll",
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
            {showZoomSlider && (
              <div
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                // onMouseDown={e => {
                //   e.stopPropagation();
                // }}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  minWidth: 100
                }}
              >
                {console.log("charWidth:", charWidth)}
                <UncontrolledSliderWithPlusMinusBtns
                  onRelease={val => {
                    console.log("val:", val);
                    this.setState({ charWidth: val });
                  }}
                  title="Adjust Zoom Level"
                  style={{ paddingTop: "3px", width: 100 }}
                  className={"alignment-zoom-slider"}
                  labelRenderer={false}
                  stepSize={0.01}
                  initialValue={this.charWidth}
                  max={14}
                  min={(width - marginWidth) / this.getMaxLength()}
                />
              </div>
            )}
            <RowItem
              {...{
                ...rest,
                charWidth: this.charWidth,
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
    <div
      className="veCircViewSvgCenterText"
      key="circViewSvgCenterText"
      style={{
        position: "sticky",
        left: "0",
        textAlign: "center"
      }}
    >
      <span>{sequenceName} </span>
      <br />
      <span>{sequenceLength + " bps"}</span>
    </div>
  );
}

export default withEditorInteractions(LinearView);
