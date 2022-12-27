import { Button } from "@blueprintjs/core";
import draggableClassnames from "../constants/draggableClassnames";
import { some, isEqual, debounce } from "lodash";
import prepareRowData from "../utils/prepareRowData";
import React from "react";
import Draggable from "react-draggable";
import RowItem from "../RowItem";
import ReactList from "@teselagen/react-list";
import withEditorInteractions from "../withEditorInteractions";
import estimateRowHeight, { rowHeights } from "./estimateRowHeight";
import {
  defaultContainerWidth,
  defaultMarginWidth,
  defaultCharWidth
} from "../constants/rowviewContants";
import getBpsPerRow from "../withEditorInteractions/getBpsPerRow";

// import TrMmInfScroll from "./TrMmInfScroll";

// import ReactList from './ReactVariable';
import "./style.css";
import { getClientX, getClientY, getEmptyText } from "../utils/editorUtils";
import isMobile from "is-mobile";
import classnames from "classnames";
// import getCutsiteLabelHeights from "../RowItem/getCutsiteLabelHeights";
// import Combokeys from "combokeys";

function noop() {}

const rowJumpButtonStyle = {
  height: rowHeights.rowJumpButtons.height
};

const bounds = { top: 0, left: 0, right: 0, bottom: 0 };
export class RowView extends React.Component {
  static defaultProps = {
    sequenceData: { sequence: "" },
    selectionLayer: {},
    // bpToJumpTo:0,
    editorDragged: noop,
    editorDragStarted: noop,
    editorClicked: noop,
    backgroundRightClicked: noop,
    editorDragStopped: noop,
    // onScroll: noop,
    width: defaultContainerWidth,
    marginWidth: defaultMarginWidth,
    height: 400,
    charWidth: defaultCharWidth,
    RowItemProps: {}
  };

  shouldClearCache = () => {
    const { annotationVisibility, annotationLabelVisibility, sequenceData } =
      this.props;
    const toCompare = {
      bpsPerRow: getBpsPerRow(this.props),
      annotationVisibility,
      scalePct: this.state?.scalePct,
      annotationLabelVisibility,
      stateTrackingId: sequenceData.stateTrackingId
    };
    if (!isEqual(toCompare, this.oldToCompare)) {
      this.cache = {};
      this.oldToCompare = toCompare;
      return true;
    }
  };

  //this function gives a fairly rough height estimate for the rows so that the ReactList can give a good guess of how much space to leave for scrolling and where to jump to in the sequence
  estimateRowHeight = (index, cache) => {
    const { annotationVisibility, annotationLabelVisibility, sequenceData } =
      this.props;
    return estimateRowHeight({
      index,
      cache,
      chromatogramData: sequenceData.chromatogramData,
      showJumpButtons: this.showJumpButtons,
      clearCache: this.clearCache,
      row: this.rowData[index],
      rowCount: this.rowData.length,
      annotationVisibility,
      annotationLabelVisibility
    });
  };
  getNearestCursorPositionToMouseEvent = (rowData, event, callback) => {
    const { charWidth = defaultCharWidth, sequenceLength } = this.props;
    let rowNotFound = true;
    const visibleRowsContainer =
      this.InfiniteScroller && this.InfiniteScroller.items;
    //loop through all the rendered rows to see if the click event lands in one of them
    let nearestCaretPos = 0;

    const selectionStartGrabbed = event.target.classList.contains(
      draggableClassnames.selectionStart
    );
    const selectionEndGrabbed = event.target.classList.contains(
      draggableClassnames.selectionEnd
    );
    some(visibleRowsContainer.childNodes, function (rowDomNode) {
      const boundingRowRect = rowDomNode.getBoundingClientRect();
      if (
        getClientY(event) > boundingRowRect.top &&
        getClientY(event) < boundingRowRect.top + boundingRowRect.height
      ) {
        //then the click is falls within this row
        rowNotFound = false;
        const row = rowData[Number(rowDomNode.getAttribute("data-row-number"))];
        if (getClientX(event) - boundingRowRect.left < 0) {
          nearestCaretPos = row.start;
        } else {
          const clickXPositionRelativeToRowContainer =
            getClientX(event) - boundingRowRect.left;
          const numberOfBPsInFromRowStart = Math.floor(
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
      const { top, bottom } = visibleRowsContainer.getBoundingClientRect();
      const numbers = [top, bottom];
      const target = getClientY(event);
      const topOrBottom = numbers
        .map(function (value, index) {
          return [Math.abs(value - target), index];
        })
        .sort()
        .map(function (value) {
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
        const row = rowData[Number(rowDomNode.getAttribute("data-row-number"))];
        //return the last bp index in the rendered rows
        nearestCaretPos = row.end;
      } else {
        nearestCaretPos = 0;
      }
    }
    if (this.props.sequenceData.isProtein) {
      nearestCaretPos = Math.round(nearestCaretPos / 3) * 3;
    }
    if (sequenceLength === 0) nearestCaretPos = 0;
    callback({
      doNotWrapOrigin: !(
        this.props.sequenceData && this.props.sequenceData.circular
      ),
      event,
      className: event.target.className,
      shiftHeld: event.shiftKey,
      nearestCaretPos,
      selectionStartGrabbed,
      selectionEndGrabbed
    });
  };

  UNSAFE_componentWillReceiveProps(props) {
    //we haven't yet called this function yet, so to make sure it jumps to the selected bps we just set a variable on the class
    this.updateScrollPosition(
      this.calledUpdateScrollOnce ? this.props : {},
      props
    );
  }
  updateScrollPosition = (oldProps, newProps) => {
    this.cache = {};
    if (this.dragging === true) {
      return;
    }
    const {
      caretPosition = -1,
      selectionLayer = {},
      matchedSearchLayer = {}
    } = newProps;
    const {
      caretPosition: caretPositionOld = -1,
      selectionLayer: selectionLayerOld = {},
      matchedSearchLayer: matchedSearchLayerOld = {}
    } = oldProps;

    const bpsPerRow = getBpsPerRow(newProps);
    //UPDATE THE ROW VIEW'S POSITION BASED ON CARET OR SELECTION CHANGES
    // let previousBp;
    let scrollToBp = -1;
    if (
      matchedSearchLayer.start > -1 &&
      ((matchedSearchLayer.forceUpdate &&
        matchedSearchLayer.forceUpdate !== matchedSearchLayerOld.forceUpdate) ||
        matchedSearchLayer.start !== matchedSearchLayerOld.start)
    ) {
      // previousBp = matchedSearchLayerOld.start;
      scrollToBp = matchedSearchLayer.start;
    } else if (
      matchedSearchLayer.end > -1 &&
      ((matchedSearchLayer.forceUpdate &&
        matchedSearchLayer.forceUpdate !== matchedSearchLayerOld.forceUpdate) ||
        matchedSearchLayer.end !== matchedSearchLayerOld.end)
    ) {
      // previousBp = selectionLayerOld.end;
      scrollToBp = matchedSearchLayer.end;
    } else if (caretPosition > -1 && caretPosition !== caretPositionOld) {
      // previousBp = caretPositionOld;
      scrollToBp = caretPosition;
    } else if (
      selectionLayer.start > -1 &&
      ((selectionLayer.forceUpdate &&
        selectionLayer.forceUpdate !== selectionLayerOld.forceUpdate &&
        selectionLayer.forceUpdate !== "end") ||
        (selectionLayer.start !== selectionLayerOld.start &&
          !selectionLayer.isFromRowView))
    ) {
      // previousBp = selectionLayerOld.start;
      scrollToBp = selectionLayer.start;
    } else if (
      selectionLayer.end > -1 &&
      ((selectionLayer.forceUpdate &&
        selectionLayer.forceUpdate !== selectionLayerOld.forceUpdate &&
        selectionLayer.forceUpdate !== "start") ||
        (selectionLayer.end !== selectionLayerOld.end &&
          !selectionLayer.isFromRowView))
    ) {
      // previousBp = selectionLayerOld.end;
      scrollToBp = selectionLayer.end;
    }
    if (
      scrollToBp > -1 &&
      this.InfiniteScroller &&
      this.InfiniteScroller.scrollTo
    ) {
      this.calledUpdateScrollOnce = true;
      const rowToScrollTo = Math.floor(scrollToBp / bpsPerRow);
      const [start, end] = this.InfiniteScroller.getVisibleRange();
      // const jumpToBottomOfRow = scrollToBp > previousBp;
      if (rowToScrollTo < start || rowToScrollTo > end) {
        //wrap this in a set timeout to give onDoubleClick enough time to fire before jumping the rowview around
        setTimeout(() => {
          this.InfiniteScroller &&
            this.InfiniteScroller.scrollTo(rowToScrollTo);
        }, 0);
        clearInterval(this.jumpIntervalId); //tnr this was triggering a nasty error in cypress related to sinon -
        //this will try to run the following logic at most 10 times with a 100ms pause between each
        this.jumpIntervalId = setIntervalX(
          () => {
            if (!this.InfiniteScroller) return; //this might be undefined if we've already unmounted
            const [el] = this.InfiniteScroller.items.querySelectorAll(
              `[data-row-number="${rowToScrollTo}"]`
            );
            if (!el) {
              //sometimes the el isn't on the page even after the jump because of drawing issues, so we'll try the scroll one more time
              this.InfiniteScroller &&
                this.InfiniteScroller.scrollTo(rowToScrollTo);
              return;
            } else {
              el.scrollIntoView &&
                el.scrollIntoView({
                  behavior: "auto",
                  block: "center",
                  inline: "center"
                });
              try {
                //djr I think there is some double clearing going on here causing cypress to fail so now its in a try block
                clearInterval(this.jumpIntervalId);
              } catch {
                console.error();
              }
            }
            //tnr: we can't use the following because it messes up the scroll of the Reflex panels
            //causing the tabs to not be shown
            // el.scrollIntoView && el.scrollIntoView();
          },
          100,
          10 //tnr: we could run this more than 5 times.. doesn't really matter
        );
      }
    }
  };

  cache = {};

  getRowData = (sequenceData, bpsPerRow) => {
    if (
      !isEqual(bpsPerRow, this.oldBpsPerRow) ||
      !isEqual(sequenceData, this.oldSeqData)
    ) {
      this.rowData = prepareRowData(
        {
          ...sequenceData,
          features: sequenceData.filteredFeatures || sequenceData.features,
          parts: sequenceData.filteredParts || sequenceData.parts
        },
        bpsPerRow
      );
      this.oldBpsPerRow = bpsPerRow;
      this.oldSeqData = sequenceData;
    }
    return this.rowData;
  };

  renderItem = (index) => {
    if (this.cache[index]) return this.cache[index];
    const {
      //currently found in props
      sequenceData,
      // bpToJumpTo,
      editorDragged,
      editorDragStarted,
      editorClicked,
      caretPosition,
      backgroundRightClicked,
      editorDragStopped,
      // onScroll,
      width,
      marginWidth,
      height,
      truncateLabelsThatDoNotFit,
      RowItemProps,
      ...rest
    } = this.props;

    let rowTopComp;
    let rowBottomComp;
    const rowData = this.rowData;
    const bpsPerRow = this.bpsPerRow;

    this.showJumpButtons = rowData.length > 15;
    if (this.showJumpButtons) {
      if (index === 0) {
        rowTopComp = (
          <div style={rowJumpButtonStyle}>
            <Button
              style={{ fontStyle: "italic" }}
              intent="primary"
              icon="arrow-down"
              minimal
              data-test="jumpToEndButton"
              onClick={(e) => {
                e.stopPropagation();
                this.InfiniteScroller &&
                  this.InfiniteScroller.scrollTo(rowData.length);
              }}
            >
              Jump to end
            </Button>
          </div>
        );
      } else if (index === rowData.length - 1) {
        rowBottomComp = (
          <div style={rowJumpButtonStyle}>
            <Button
              style={{ fontStyle: "italic" }}
              intent="primary"
              icon="arrow-up"
              minimal
              data-test="jumpToStartButton"
              onClick={(e) => {
                e.stopPropagation();
                this.InfiniteScroller && this.InfiniteScroller.scrollTo(0);
              }}
            >
              Jump to start
            </Button>
          </div>
        );
      }
    }

    if (rowData[index]) {
      const rowItem = (
        <div data-row-number={index} key={index}>
          <div className="veRowItemSpacer" />

          <RowItem
            {...{
              ...rest,
              rowTopComp,
              truncateLabelsThatDoNotFit,
              rowBottomComp,
              scalePct: this.state?.scalePct,
              setScalePct: (scalePct) => {
                this.setState({ scalePct });
              },
              isRowView: true,
              isProtein: sequenceData.isProtein,
              chromatogramData: sequenceData.chromatogramData,
              sequenceLength: sequenceData.sequence.length,
              bpsPerRow,
              caretPosition,
              emptyText: getEmptyText({ sequenceData, caretPosition }),
              fullSequence: sequenceData.sequence,
              ...RowItemProps
            }}
            row={rowData[index]}
          />
          {index === rowData.length - 1 ? (
            <div className="veRowItemSpacer" />
          ) : null}
        </div>
      );
      this.cache[index] = rowItem;
      return rowItem;
    } else {
      return null;
    }
  };
  onDrag = (event) => {
    if (isMobile({ tablet: true })) {
      if (
        //only allow dragging on mobile if the user is grabbing the cursor
        !some(draggableClassnames, (cn) => {
          if (event.target.classList.contains(cn)) {
            return true;
          }
        })
      ) {
        return;
      }
    }

    this.dragging = true;
    const rowData = this.rowData;
    this.getNearestCursorPositionToMouseEvent(
      rowData,
      event,
      this.props.editorDragged
    );
  };
  onStart = (event) => {
    this.dragging = true;
    const rowData = this.rowData;
    this.getNearestCursorPositionToMouseEvent(
      rowData,
      event,
      this.props.editorDragStarted
    );
  };

  onStop = (e) => {
    this.dragging = false;
    this.props.editorDragStopped(e);
  };

  getRef = (ref) => (this.node = ref);

  onContextMenu = (event) => {
    this.getNearestCursorPositionToMouseEvent(
      this.rowData,
      event,
      this.props.backgroundRightClicked
    );
  };
  onClick = (event) => {
    this.getNearestCursorPositionToMouseEvent(
      this.rowData,
      event,
      this.props.editorClicked
    );
  };

  getReactListRef = (c) => {
    this.InfiniteScroller = c;
    !this.calledUpdateScrollOnce && this.updateScrollPosition({}, this.props); //trigger the scroll here as well because now we actually have the infinite scroller component accessible
  };

  render() {
    let {
      //currently found in props
      sequenceData,
      width,
      marginWidth,
      height,
      className
    } = this.props;
    if (width === "100%") {
      //we can't render an actual 100% width row view (we need a pixel measurement but we get passed width=100% by react-measure)
      return <div style={{ width, height: height || 300 }} />;
    }
    if (marginWidth < defaultMarginWidth) {
      marginWidth = defaultMarginWidth;
    }
    const containerWidthMinusMargin = width - marginWidth;
    const bpsPerRow = getBpsPerRow(this.props);
    this.bpsPerRow = bpsPerRow;

    //the width we pass to the rowitem needs to be the exact width of the bps so we need to trim off any extra space:
    const rowData = this.getRowData(sequenceData, bpsPerRow);
    this.rowData = rowData;

    const shouldClear = this.shouldClearCache();
    return (
      <Draggable
        bounds={bounds}
        onDrag={this.onDrag}
        onStart={this.onStart}
        onStop={this.onStop}
      >
        <div
          ref={this.getRef}
          className={classnames("veRowView", className)}
          style={{
            overflowY: "auto",
            overflowX: "visible",
            height: height || 300,
            width: containerWidthMinusMargin + marginWidth,
            paddingLeft: marginWidth / 2,
            paddingRight: marginWidth / 2,
            ...(isMobile && { touchAction: "inherit" })
          }}
          onContextMenu={this.onContextMenu}
          onScroll={onScroll}
          onClick={this.onClick}
        >
          <ReactList
            ref={this.getReactListRef}
            clearCache={shouldClear}
            itemRenderer={this.renderItem}
            length={rowData.length}
            itemSizeEstimator={this.estimateRowHeight}
            type="variable"
          />
        </div>
      </Draggable>
    );
  }
}

export default withEditorInteractions(RowView);

function onScroll() {
  window.__veScrolling = true;
  setTimeout(endScroll);
}

const endScroll = debounce(() => {
  window.__veScrolling = false;
}, 100);

function setIntervalX(callback, delay, repetitions) {
  let x = 0;
  const intervalID = window.setInterval(function () {
    callback();

    if (++x === repetitions) {
      try {
        //djr I think there is some double clearing going on here so I put it in a try block
        window.clearInterval(intervalID);
      } catch {
        console.error();
      }
    }
  }, delay);
  return intervalID;
}
