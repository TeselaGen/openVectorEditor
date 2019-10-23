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
import { getEmptyText } from "../utils/editorUtils";
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
    const {
      annotationVisibility,
      annotationLabelVisibility,
      sequenceData
    } = this.props;

    const toCompare = {
      bpsPerRow: getBpsPerRow(this.props),
      annotationVisibility,
      annotationLabelVisibility,
      stateTrackingId: sequenceData.stateTrackingId
    };
    if (!isEqual(toCompare, this.oldToCompare)) {
      this.oldToCompare = toCompare;
      return true;
    }
  };

  //this function gives a fairly rough height estimate for the rows so that the ReactList can give a good guess of how much space to leave for scrolling and where to jump to in the sequence
  estimateRowHeight = (index, cache) => {
    const { annotationVisibility, annotationLabelVisibility } = this.props;
    return estimateRowHeight({
      index,
      cache,
      showJumpButtons: this.showJumpButtons,
      clearCache: this.clearCache,
      row: this.rowData[index],
      rowCount: this.rowData.length,
      annotationVisibility,
      annotationLabelVisibility
    });
  };
  getNearestCursorPositionToMouseEvent = (rowData, event, callback) => {
    let { charWidth = defaultCharWidth, sequenceLength } = this.props;
    let rowNotFound = true;
    let visibleRowsContainer =
      this.InfiniteScroller && this.InfiniteScroller.items;
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
    if (this.props.sequenceData.isProtein) {
      nearestCaretPos = Math.round(nearestCaretPos / 3) * 3;
    }
    if (sequenceLength === 0) nearestCaretPos = 0;
    callback({
      event,
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

  // componentDidMount() {
  //   this.mounted=true
  // }
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
    let {
      caretPosition = -1,
      selectionLayer = {},
      matchedSearchLayer = {}
    } = newProps;

    let {
      caretPosition: caretPositionOld = -1,
      selectionLayer: selectionLayerOld = {},
      matchedSearchLayer: matchedSearchLayerOld = {}
    } = oldProps;
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
        selectionLayer.start !== selectionLayerOld.start)
    ) {
      // previousBp = selectionLayerOld.start;
      scrollToBp = selectionLayer.start;
    } else if (
      selectionLayer.end > -1 &&
      ((selectionLayer.forceUpdate &&
        selectionLayer.forceUpdate !== selectionLayerOld.forceUpdate &&
        selectionLayer.forceUpdate !== "start") ||
        selectionLayer.end !== selectionLayerOld.end)
    ) {
      // previousBp = selectionLayerOld.end;
      scrollToBp = selectionLayer.end;
    }

    let bpsPerRow = getBpsPerRow(newProps);
    if (
      scrollToBp > -1 &&
      this.InfiniteScroller &&
      this.InfiniteScroller.scrollTo
    ) {
      this.calledUpdateScrollOnce = true;
      let rowToScrollTo = Math.floor(scrollToBp / bpsPerRow);
      let [start, end] = this.InfiniteScroller.getVisibleRange();
      // const jumpToBottomOfRow = scrollToBp > previousBp;
      if (rowToScrollTo < start || rowToScrollTo > end) {
        this.InfiniteScroller.scrollTo(rowToScrollTo);
        clearInterval(this.jumpIntervalId);
        //this will try to run the following logic at most 10 times with a 100ms pause between each
        this.jumpIntervalId = setIntervalX(
          () => {
            if (!this.InfiniteScroller) return; //this might be undefined if we've already unmounted
            const [el] = this.InfiniteScroller.items.querySelectorAll(
              `[data-row-number="${rowToScrollTo}"]`
            );
            if (!el) {
              //sometimes the el isn't on the page even after the jump because of drawing issues, so we'll try the scroll one more time
              this.InfiniteScroller.scrollTo(rowToScrollTo);
              return;
            } else {
              clearInterval(this.jumpIntervalId);
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
          features: sequenceData.filteredFeatures || sequenceData.features
        },
        bpsPerRow
      );
      this.oldBpsPerRow = bpsPerRow;
      this.oldSeqData = sequenceData;
    }
    return this.rowData;
  };

  renderItem = index => {
    if (this.cache[index]) return this.cache[index];
    let {
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
              data-test="jumpToEndButton"
              onClick={e => {
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
              data-test="jumpToStartButton"
              onClick={e => {
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
      let rowItem = (
        <div data-row-number={index} key={index}>
          <div className="veRowItemSpacer" />

          <RowItem
            {...{
              ...rest,
              rowTopComp,
              rowBottomComp,
              isProtein: sequenceData.isProtein,
              sequenceLength: sequenceData.sequence.length,
              bpsPerRow,
              caretPosition,
              emptyText: getEmptyText({ sequenceData, caretPosition }),
              fullSequence: sequenceData.sequence,
              ...RowItemProps
            }}
            row={rowData[index]}
          />
        </div>
      );
      this.cache[index] = rowItem;
      return rowItem;
    } else {
      return null;
    }
  };
  onDrag = event => {
    this.dragging = true;
    const rowData = this.rowData;
    this.getNearestCursorPositionToMouseEvent(
      rowData,
      event,
      this.props.editorDragged
    );
  };
  onStart = event => {
    this.dragging = true;
    const rowData = this.rowData;
    this.getNearestCursorPositionToMouseEvent(
      rowData,
      event,
      this.props.editorDragStarted
    );
  };

  onStop = e => {
    this.dragging = false;
    this.props.editorDragStopped(e);
  };

  getRef = ref => (this.node = ref);

  onContextMenu = event => {
    this.getNearestCursorPositionToMouseEvent(
      this.rowData,
      event,
      this.props.backgroundRightClicked
    );
  };
  onClick = event => {
    this.getNearestCursorPositionToMouseEvent(
      this.rowData,
      event,
      this.props.editorClicked
    );
  };

  getReactListRef = c => {
    this.InfiniteScroller = c;
    !this.calledUpdateScrollOnce && this.updateScrollPosition({}, this.props); //trigger the scroll here as well because now we actually have the infinite scroller component accessible
  };

  render() {
    let {
      //currently found in props
      sequenceData,
      // bpToJumpTo,
      // editorDragged,
      // editorDragStarted,
      // editorClicked,
      // backgroundRightClicked,
      // editorDragStopped,
      // onScroll,
      width,
      marginWidth,
      height
      // RowItemProps,
    } = this.props;
    if (width === "100%") {
      //we can't render an actual 100% width row view (we need a pixel measurement but we get passed width=100% by react-measure)
      return <div style={{ width, height: height || 300 }} />;
    }
    if (marginWidth < defaultMarginWidth) {
      marginWidth = defaultMarginWidth;
    }
    let containerWidthMinusMargin = width - marginWidth;
    let bpsPerRow = getBpsPerRow(this.props);
    this.bpsPerRow = bpsPerRow;

    //the width we pass to the rowitem needs to be the exact width of the bps so we need to trim off any extra space:
    // let containerWidthMinusMarginMinusAnyExtraSpaceUpTo1Bp =
    //  propsToUse.charWidth * bpsPerRow;
    let rowData = this.getRowData(sequenceData, bpsPerRow);
    this.rowData = rowData;

    const shouldClear = this.shouldClearCache();
    return (
      <Draggable
        // enableUserSelectHack={false} //needed to prevent the input bubble from losing focus post user drag
        bounds={bounds}
        onDrag={this.onDrag}
        onStart={this.onStart}
        onStop={this.onStop}
      >
        <div
          // tabIndex="0"
          ref={this.getRef}
          className="veRowView"
          style={{
            overflowY: "auto",
            overflowX: "visible",
            height: height || 300,
            width: containerWidthMinusMargin + marginWidth,
            paddingLeft: marginWidth / 2,
            paddingRight: marginWidth / 2
          }}
          // onScroll={disablePointers} //tnr: this doesn't actually help much with scrolling performance
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

// function itemSizeEstimator(index, cache) {
//   if (cache[index]) {
//     return cache[index];
//   }
//   return 400;
// }

// const disablePointers = () => {
//   clearTimeout(this.timer);
//   if(!document.body.classList.contains('disable-hover')) {
//     document.body.classList.add('disable-hover')
//   }

//   this.timer = setTimeout(function(){
//     document.body.classList.remove('disable-hover')
//   },0);
// }

// function onScroll() {
//   window.__veScrolling = true;
//   setTimeout(() => {
//     window.__veScrolling = false;
//   });
// }
function onScroll() {
  window.__veScrolling = true;
  setTimeout(endScroll);
}

const endScroll = debounce(() => {
  window.__veScrolling = false;
}, 100);

function setIntervalX(callback, delay, repetitions) {
  let x = 0;
  let intervalID = window.setInterval(function() {
    callback();

    if (++x === repetitions) {
      window.clearInterval(intervalID);
    }
  }, delay);
  return intervalID;
}
