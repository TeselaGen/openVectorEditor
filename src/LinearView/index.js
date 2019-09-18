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
import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";

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
  state = {
    zoomLevel: 1
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
    this.charWidth =
      (charWidth || innerWidth / this.getMaxLength()) * this.state.zoomLevel;
    const bpsPerRow = this.getMaxLength();
    let sequenceName = hideName ? "" : sequenceData.name || "";
    let rowData = this.getRowData();
    // width = innerWidth * this.state.zoomLevel
    // maxWidth = this.getMaxLength() * 12
    
    // maxzoomLevel = this.getMaxLength() * 12 /innerWidth

const maxZoom = this.getMaxLength() * 11 /innerWidth
    return (
      <React.Fragment>
        <UncontrolledSliderWithPlusMinusBtns
          onChange={val => {
            this.setState({
              zoomLevel: val
            });
            setTimeout(() => {
              (
                document.querySelector(".veLinearView .veSelectionLayer") ||
                document.querySelector(".veLinearView .veCaret")
              ).scrollIntoView({ inline: "center" });
            }, 0);
          }}
          onRelease={val => {
            this.setState({
              zoomLevel: val
            });
          }}
          title="Adjust Zoom Level"
          style={{ paddingTop: "4px", width: 100 }}
          className="alignment-zoom-slider"
          labelRenderer={false}
          stepSize={1}
          initialValue={1}
          max={maxZoom}
          min={1}
        />
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
              console.log(`onClick`);
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
            <div style={{ overflow: "auto" }}>
              <RowItem
                {...{
                  ...rest,
                  charWidth: this.charWidth,
                  caretPosition,
                  isProtein: sequenceData.isProtein,
                  alignmentData,
                  sequenceLength: this.getMaxLength(),
                  width: innerWidth * this.state.zoomLevel,
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
                    sequence: this.charWidth < 12,
                    cutsitesInSequence: false,
                    ...annotationVisibilityOverrides
                  },
                  ...RowItemProps
                }}
                row={rowData[0]}
              />
            </div>
          </div>
        </Draggable>
      </React.Fragment>
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
