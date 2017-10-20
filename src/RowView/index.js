import { Button } from "@blueprintjs/core";
import draggableClassnames from "../constants/draggableClassnames";
import some from "lodash/some";
// import moveCaret from "../withEditorInteractions/moveCaret";
// import handleCaretMoved from "../withEditorInteractions/handleCaretMoved";
import prepareRowData from "../utils/prepareRowData";
import React from "react";
import Draggable from "react-draggable";
import RowItem from "../RowItem";
import ReactList from "react-list";
import withEditorInteractions from "../withEditorInteractions";
import "./style.css";
// import Combokeys from "combokeys";

let defaultContainerWidth = 400;
let defaultCharWidth = 12;
let defaultMarginWidth = 50;

function noop() {}

export class RowView extends React.Component {
  static defaultProps = {
    sequenceData: { sequence: "" },
    selectionLayer: {},
    // bpToJumpTo:0,
    editorDragged: noop,
    editorDragStarted: noop,
    editorClicked: noop,
    editorDragStopped: noop,
    onScroll: noop,
    width: defaultContainerWidth,
    marginWidth: defaultMarginWidth,
    height: 400,
    charWidth: defaultCharWidth,
    RowItemProps: {}
  };
  getNearestCursorPositionToMouseEvent = (rowData, event, callback) => {
    let { charWidth = defaultCharWidth } = this.props;
    let rowNotFound = true;
    let visibleRowsContainer = this.InfiniteScroller.items;
    //loop through all the rendered rows to see if the click event lands in one of them
    let nearestCaretPos = 0;
    some(visibleRowsContainer.childNodes, function(rowDomNode) {
      let boundingRowRect = rowDomNode.getBoundingClientRect();
      if (
        event.clientY > boundingRowRect.top &&
        event.clientY < boundingRowRect.top + boundingRowRect.height
      ) {
        //then the click is falls within this row
        rowNotFound = false;
        let row = rowData[Number(rowDomNode.getAttribute("data-row-number"))];
        if (event.clientX - boundingRowRect.left < 0) {
          nearestCaretPos = row.start;
        } else {
          let clickXPositionRelativeToRowContainer =
            event.clientX - boundingRowRect.left;
          let numberOfBPsInFromRowStart = Math.floor(
            (clickXPositionRelativeToRowContainer + charWidth / 2) / charWidth
          );
          nearestCaretPos = numberOfBPsInFromRowStart + row.start;
          if (nearestCaretPos > row.end + 1) {
            nearestCaretPos = row.end + 1;
          }
        }
        return true; //break the loop early because we found the row the click event landed in
      }
    });
    if (rowNotFound) {
      let { top, bottom } = visibleRowsContainer.getBoundingClientRect();
      let numbers = [top, bottom];
      let target = event.clientY;
      let topOrBottom = numbers
        .map(function(value, index) {
          return [Math.abs(value - target), index];
        })
        .sort()
        .map(function(value) {
          return numbers[value[1]];
        })[0];
      let rowDomNode;
      if (topOrBottom === top) {
        rowDomNode = visibleRowsContainer.childNodes[0];
      } else {
        rowDomNode =
          visibleRowsContainer.childNodes[
            visibleRowsContainer.childNodes.length - 1
          ];
      }
      if (rowDomNode) {
        let row = rowData[Number(rowDomNode.getAttribute("data-row-number"))];
        //return the last bp index in the rendered rows
        nearestCaretPos = row.end;
      } else {
        nearestCaretPos = 0;
      }
    }
    callback({
      className: event.target.className,
      shiftHeld: event.shiftKey,
      nearestCaretPos,
      selectionStartGrabbed: event.target.classList.contains(
        draggableClassnames.selectionStart
      ),
      selectionEndGrabbed: event.target.classList.contains(
        draggableClassnames.selectionEnd
      )
    });
  };

  componentWillReceiveProps(props) {
    let { caretPosition, selectionLayer, matchedSearchLayer } = props;

    //UPDATE THE ROW VIEW'S POSITION BASED ON CARET OR SELECTION CHANGES
    let previousBp;
    let scrollToBp = -1;
    if (
      matchedSearchLayer.start > -1 &&
      matchedSearchLayer.start !== this.props.matchedSearchLayer.start
    ) {
      previousBp = this.props.matchedSearchLayer.start;
      scrollToBp = matchedSearchLayer.start;
    } else if (
      matchedSearchLayer.end > -1 &&
      matchedSearchLayer.end !== this.props.selectionLayer.end
    ) {
      previousBp = this.props.selectionLayer.end;
      scrollToBp = selectionLayer.end;
    } else if (
      caretPosition > -1 &&
      caretPosition !== this.props.caretPosition
    ) {
      previousBp = this.props.caretPosition;
      scrollToBp = caretPosition;
    } else if (
      selectionLayer.start > -1 &&
      selectionLayer.start !== this.props.selectionLayer.start
    ) {
      previousBp = this.props.selectionLayer.start;
      scrollToBp = selectionLayer.start;
    } else if (
      selectionLayer.end > -1 &&
      selectionLayer.end !== this.props.selectionLayer.end
    ) {
      previousBp = this.props.selectionLayer.end;
      scrollToBp = selectionLayer.end;
    }

    let bpsPerRow = getBpsPerRow(props);

    if (scrollToBp > -1 && this.InfiniteScroller.scrollTo) {
      let rowToScrollTo = Math.floor(scrollToBp / bpsPerRow);
      let [start, end] = this.InfiniteScroller.getVisibleRange();
      if (rowToScrollTo < start || rowToScrollTo > end) {
        this.InfiniteScroller.scrollTo(rowToScrollTo, {
          jumpToBottomOfRow: scrollToBp > previousBp
        });
      }
    }
  }

  render() {
    let {
      //currently found in props
      sequenceData,
      // bpToJumpTo,
      editorDragged,
      editorDragStarted,
      editorClicked,
      editorDragStopped,
      onScroll,
      width,
      marginWidth,
      height,
      RowItemProps,
      ...rest
    } = this.props;
    if (marginWidth < defaultMarginWidth) {
      marginWidth = defaultMarginWidth;
    }
    let containerWidthMinusMargin = width - marginWidth;
    let bpsPerRow = getBpsPerRow(this.props);

    //the width we pass to the rowitem needs to be the exact width of the bps so we need to trim off any extra space:
    // let containerWidthMinusMarginMinusAnyExtraSpaceUpTo1Bp =
    //  propsToUse.charWidth * bpsPerRow;
    let rowData = prepareRowData(sequenceData, bpsPerRow);
    let showJumpButtons = rowData.length > 15;
    let renderItem = (index, key) => {
      if (showJumpButtons) {
        if (index === 0) {
          return (
            <div data-row-number={index} key={key}>
              <Button
                onClick={e => {
                  e.stopPropagation();
                  this.InfiniteScroller.scrollTo(rowData.length);
                }}
              >
                Jump to end
              </Button>
            </div>
          );
        } else if (index === rowData.length + 1) {
          return (
            <div data-row-number={index - 2} key={key}>
              <Button
                onClick={e => {
                  e.stopPropagation();
                  this.InfiniteScroller.scrollTo(0);
                }}
              >
                Jump to start
              </Button>
            </div>
          );
        }
      }
      let indexToUse = showJumpButtons ? index - 1 : index;
      if (rowData[indexToUse]) {
        return (
          <div data-row-number={indexToUse} key={key}>
            <div className={"veRowItemSpacer"} />
            <RowItem
              {...{
                ...rest,
                sequenceLength: sequenceData.sequence.length,
                bpsPerRow,
                fullSequence: sequenceData.sequence,
                ...RowItemProps
              }}
              row={rowData[indexToUse]}
            />
          </div>
        );
      } else {
        return null;
      }
    };

    return (
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
          tabIndex="0"
          ref={ref => (this.node = ref)}
          className="veRowView"
          style={{
            overflowY: "auto",
            overflowX: "visible",
            height,
            width: containerWidthMinusMargin + marginWidth,
            paddingLeft: marginWidth / 2,
            paddingRight: marginWidth / 2
          }}
          onScroll={onScroll}
          onClick={event => {
            this.getNearestCursorPositionToMouseEvent(
              rowData,
              event,
              editorClicked
            );
          }}
        >
          <ReactList
            ref={c => {
              this.InfiniteScroller = c;
            }}
            itemRenderer={renderItem}
            length={rowData.length > 10 ? rowData.length + 2 : rowData.length}
            itemSizeEstimator={itemSizeEstimator}
            type="variable"
          />
        </div>
      </Draggable>
    );
  }
}

export default withEditorInteractions(RowView);

function getBpsPerRow({
  charWidth = defaultCharWidth,
  width = defaultContainerWidth,
  marginWidth = defaultMarginWidth
}) {
  return Math.floor((width - marginWidth) / charWidth);
}

function itemSizeEstimator(index, cache) {
  if (cache[index + 1]) {
    return cache[index + 1];
  }
  if (cache[index - 1]) {
    return cache[index - 1];
  }
  return 100;
}
