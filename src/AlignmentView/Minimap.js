import React from "react";
import Draggable from "react-draggable";
import ReactList from "@teselagen/react-list";
import Axis from "../RowItem/Axis";
import getXStartAndWidthFromNonCircularRange from "../RowItem/getXStartAndWidthFromNonCircularRange";
import { view } from "@risingstack/react-easy-state";
import { flatMap, some } from "lodash";
import {
  getOverlapOfNonCircularRanges,
  invertRange,
  isPositionWithinRange,
  splitRangeIntoTwoPartsIfItIsCircular
} from "ve-range-utils";
import { massageTickSpacing } from "../utils/massageTickSpacing";
import { getClientX, getClientY } from "../utils/editorUtils";
export default class Minimap extends React.Component {
  shouldComponentUpdate(newProps) {
    const { props } = this;
    if (
      [
        "alignmentTracks",
        "numBpsShownInLinearView",
        "scrollAlignmentView",
        "laneHeight",
        "laneSpacing"
      ].some((key) => props[key] !== newProps[key])
    )
      return true;
    return false;
  }
  handleMinimapClick = (e) => {
    if (
      this.isDragging ||
      (e.target && e.target.classList.contains("minimapCaret"))
    ) {
      e.stopPropagation();
      return;
    }
    const {
      onMinimapScrollX,
      dimensions: { width = 200 }
    } = this.props;
    const scrollHandleWidth = this.getScrollHandleWidth();
    const percent =
      (this.getXPositionOfClickInMinimap(e) - scrollHandleWidth / 2) /
      (width - scrollHandleWidth);
    onMinimapScrollX(percent);
    this.scrollMinimapVertical({ e, force: true });
  };
  getSeqLen = () => {
    const { alignmentTracks = [] } = this.props;
    const [template] = alignmentTracks;
    const seqLength = template.alignmentData.sequence.length;
    return seqLength;
  };
  /**
   * @returns current nucleotide char
   * width, nucelotide char width scales with zooming
   */
  getCharWidth = () => {
    const {
      dimensions: { width = 200 }
    } = this.props;
    const seqLength = this.getSeqLen();
    const charWidth = Math.min(16, width / seqLength);
    return charWidth || 12;
  };
  /**
   * @returns the width of the highlighted region of the minimap
   */
  getScrollHandleWidth = () => {
    const { numBpsShownInLinearView, dimensions } = this.props;
    const charWidth = this.getCharWidth();
    const { width } = getXStartAndWidthFromNonCircularRange(
      { start: 0, end: Math.max(numBpsShownInLinearView - 1, 0) },
      charWidth
    );
    return Math.min(width, dimensions.width);
  };
  getXPositionOfClickInMinimap = (e) => {
    const leftStart = this.minimap.getBoundingClientRect().left;
    return Math.max(getClientX(e) - leftStart, 0);
  };
  getYPositionOfClickInMinimap = (e) => {
    const topStart = this.minimap.getBoundingClientRect().top;
    return Math.max(getClientY(e) + this.minimapTracks.scrollTop - topStart, 0);
  };

  scrollMinimapVertical = ({ e, force, initialDragYOffsetFromCenter }) => {
    const clientY = getClientY(e) - (initialDragYOffsetFromCenter || 0);
    try {
      if (
        !force &&
        isPositionWithinRange(clientY, {
          start: this.lastYPosition - 5,
          end: this.lastYPosition + 5
        })
      ) {
        // this.lastYPosition = clientY
        return;
      }
      const lanes = document.querySelectorAll(".minimapLane");

      some(lanes, (lane) => {
        const rect = lane.getBoundingClientRect();
        if (rect.top > clientY && rect.top - rect.height < clientY) {
          this.props.scrollYToTrack(
            Math.max(lane.getAttribute("data-lane-index") - 3, 0)
          );
          return true;
        }
        return false;
      });
      this.lastYPosition = clientY;
    } catch (error) {
      console.error(`error in scrollMinimapVertical:`, error);
    }
  };
  handleDragStop = () => {
    // this.hasSetDirection = false;
    setTimeout(() => {
      this.isDragging = false;
    }, 150);
  };
  /**
   * Handler for beginning to drag across the minimap
   * Sets this.initialDragXOffsetFromCenter and Y for dragging
   * @param {*} e - event
   */
  handleDragStart = (e) => {
    const eventX = e.pageX;
    const handleEl = window.document.querySelector(".verticalScrollDisplay");
    if (!handleEl) return;
    const { x, width } = handleEl.getBoundingClientRect();
    const yellowScrollHandleXCenter = x + width / 2;
    this.initialDragXOffsetFromCenter = eventX - yellowScrollHandleXCenter;
    const eventY = e.pageY;

    if (!handleEl) return;
    const { y, height } = handleEl.getBoundingClientRect();
    const yellowScrollHandleYCenter = y + height / 2;
    this.initialDragYOffsetFromCenter = eventY - yellowScrollHandleYCenter;
  };
  /**
   * Moves the highlighted region as we drag
   * @param {*} e - event
   */
  handleDrag = (e) => {
    const {
      onMinimapScrollX,
      dimensions: { width = 200 }
    } = this.props;
    this.isDragging = true; //needed to block erroneous click events from being triggered!

    const scrollHandleWidth = this.getScrollHandleWidth();
    const percent =
      (this.getXPositionOfClickInMinimap(e) -
        (this.initialDragXOffsetFromCenter || 0) -
        scrollHandleWidth / 2) /
      (width - scrollHandleWidth);
    onMinimapScrollX(percent);
    this.scrollMinimapVertical({
      e,
      initialDragYOffsetFromCenter: this.initialDragYOffsetFromCenter
    });
  };
  /**
   * @returns this.props.laneheight
   */
  itemSizeGetter = () => {
    return this.props.laneHeight;
  };
  /**
   * Renders a lane (one by one for each call)
   * @param {*} i - lane info
   */
  renderItem = (i) => {
    const {
      alignmentTracks = [],
      dimensions: { width = 200 },
      laneHeight,
      laneSpacing = 1
    } = this.props;
    const charWidth = this.getCharWidth();

    const {
      matchHighlightRanges: _matchHighlightRanges,
      alignmentData: { trimmedRange } = {}
    } = alignmentTracks[i];
    const matchHighlightRanges = !trimmedRange
      ? _matchHighlightRanges
      : flatMap(_matchHighlightRanges, (r) => {
          const overlap = getOverlapOfNonCircularRanges(r, trimmedRange);
          if (!overlap) return [];
          return { ...r, ...overlap };
        });

    //need to get the chunks that can be rendered
    let redPath = ""; //draw these as just 1 path instead of a bunch of rectangles to improve browser performance
    let bluePath = "";
    // draw one grey rectangle then draw red/mismatching regions on top of it
    const height = laneHeight - laneSpacing;
    const y = 0;
    const firstRange = getXStartAndWidthFromNonCircularRange(
      matchHighlightRanges[0],
      charWidth
    );
    const lastRange = getXStartAndWidthFromNonCircularRange(
      matchHighlightRanges[matchHighlightRanges.length - 1],
      charWidth
    );
    bluePath += `M${firstRange.xStart},${y} L${
      lastRange.xStart + lastRange.width
    },${y} L${lastRange.xStart + lastRange.width},${y + height} L${
      firstRange.xStart
    },${y + height}`;
    matchHighlightRanges.forEach((range) => {
      const { xStart, width } = getXStartAndWidthFromNonCircularRange(
        range,
        charWidth
      );
      const toAdd = `M${xStart},${y} L${xStart + width},${y} L${
        xStart + width
      },${y + height} L${xStart},${y + height}`;
      if (!range.isMatch) {
        redPath += toAdd;
      }
    });
    return (
      <div
        key={i + "-lane"}
        className="minimapLane"
        data-lane-index={i}
        style={{ height: laneHeight, maxHeight: laneHeight }}
      >
        <svg
          height={laneHeight}
          width={width}
          shapeRendering="geometricPrecision"
        >
          <path className="miniBluePath" d={bluePath} fill="#9abeff" />
          <path className="miniRedPath" d={redPath} fill="red" />
        </svg>
      </div>
    );
  };
  /**
   * @returns minimap compoent
   */
  render() {
    const {
      alignmentTracks = [],
      dimensions: { width = 200 },
      laneHeight,
      onSizeAdjust,
      minSliderSize,
      onMinimapScrollX,
      easyStore,
      selectionLayerComp
    } = this.props;

    const [template /* ...nonTemplates */] = alignmentTracks;
    const seqLength = template.alignmentData.sequence.length;
    const charWidth = this.getCharWidth();
    const scrollHandleWidth = this.getScrollHandleWidth();
    const minimapTracksPartialHeight = laneHeight * alignmentTracks.length;

    return (
      <div
        ref={(ref) => (this.minimap = ref)}
        className="alignmentMinimap"
        style={{
          position: "relative",
          width,
          display: "flex",
          flexDirection: "column",
          overflowX: "visible"

          // overflowY: "hidden"
        }}
        onClick={this.handleMinimapClick}
      >
        {selectionLayerComp}
        <div
          ref={(ref) => {
            if (ref) {
              this.minimapTracks = ref;
            }
          }}
          style={{
            // maxHeight: 350,
            overflowY: minimapTracksPartialHeight > 190 ? "auto" : "hidden",
            // overflowY: "auto",
            overflowX: "hidden",
            position: "relative"
          }}
          className="alignmentMinimapTracks"
        >
          <YellowScrollHandle
            width={width}
            handleDragStart={this.handleDragStart}
            handleDrag={this.handleDrag}
            handleDragStop={this.handleDragStop}
            onMinimapScrollX={onMinimapScrollX}
            minSliderSize={minSliderSize}
            onSizeAdjust={onSizeAdjust}
            easyStore={easyStore} //we use react-easy-state here to prevent costly setStates from being called
            scrollHandleWidth={scrollHandleWidth}
            alignmentTracks={alignmentTracks}
            laneHeight={laneHeight}
            minimapTracksPartialHeight={minimapTracksPartialHeight}
          />

          <ReactList
            itemsRenderer={(items, ref) => (
              <div
                style={{
                  marginTop: -3
                  // paddingLeft: nameDivWidth
                }}
                ref={ref}
              >
                {items}
              </div>
            )}
            type="uniform"
            itemSizeGetter={this.itemSizeGetter}
            itemRenderer={this.renderItem}
            length={alignmentTracks.length}
          />
        </div>

        <Axis
          {...{
            row: { start: 0, end: seqLength },
            tickSpacing: massageTickSpacing(Math.floor(seqLength / 10)),
            bpsPerRow: seqLength,
            charWidth,
            annotationHeight: 15,
            sequenceLength: seqLength,
            style: {
              // paddingLeft: nameDivWidth,
              height: 17
            }
          }}
        />
      </div>
    );
  }
}
/**
 * Yellow Scroll handle
 * Responsible for designating the current viewing area
 * Also supports zoom/resizing using handles
 */
const YellowScrollHandle = view(
  class YellowScrollHandleInner extends React.Component {
    render() {
      const {
        scrollHandleWidth,
        width,
        easyStore,
        handleDrag,
        handleDragStop,
        minSliderSize,
        laneHeight,
        onSizeAdjust,
        handleDragStart,
        minimapTracksPartialHeight
      } = this.props;
      const { verticalVisibleRange, percentScrolled } = easyStore;
      const xScroll = percentScrolled * (width - scrollHandleWidth);
      return (
        <Draggable
          bounds="parent"
          zIndex={105}
          handle=".handle"
          position={{ x: xScroll, y: 0 }}
          axis="x"
          // onStart={this.onStart}
          onStop={handleDragStop}
          onDrag={handleDrag}
          onStart={handleDragStart}
        >
          <div
            style={{
              height: minimapTracksPartialHeight || 0,
              // height: "100%",
              border: "none",
              top: "0px",
              position: "absolute",
              zIndex: "10"
            }}
          >
            {/* left hand side drag handle */}
            <Draggable
              bounds={{
                left: -xScroll,
                right: scrollHandleWidth - minSliderSize
              }}
              zIndex={105}
              position={{ x: 0, y: 0 }}
              axis="x"
              onStart={(e, { x }) => {
                this.x = x;
              }}
              onStop={(e, { x }) => {
                const deltaX = x - this.x;

                const newSliderSize = scrollHandleWidth - deltaX;
                //user is resizing to the left so we need to update the scroll percentage so the slider does not jump
                const newScrollPercent = Math.min(
                  1,
                  (xScroll + deltaX) / (width - newSliderSize)
                );
                onSizeAdjust(newSliderSize, newScrollPercent);
              }}
            >
              {/* caret component */}
              <div
                style={{
                  height: minimapTracksPartialHeight || 0,
                  // height: "100%",
                  border: "none",
                  cursor: "ew-resize",
                  opacity: "1",
                  top: "0px",
                  position: "absolute",
                  zIndex: "10",
                  width: 2,
                  background: "black"
                }}
                className="minimapCaret"
              />
            </Draggable>
            {/* the actual handle component */}
            <div
              className="handle alignmentMinimapScrollHandle"
              dataname="scrollGroup"
              style={{
                height: minimapTracksPartialHeight || 0,
                border: "none",
                cursor: "move",

                zIndex: "10",
                width: scrollHandleWidth,
                background: "transparent"
              }}
            >
              {/* this is the vertical scroll position display element */}
              <div
                className="verticalScrollDisplay"
                style={{
                  height:
                    (verticalVisibleRange.end -
                      verticalVisibleRange.start +
                      1) *
                    laneHeight,
                  zIndex: "-10",
                  background: "#fbfb2873",
                  borderTop: "2px solid yellow",
                  borderBottom: "2px solid yellow",
                  position: "relative",
                  top: verticalVisibleRange.start * laneHeight
                }}
              />
            </div>
            {/* right hand side drag handle */}
            <Draggable
              bounds={{
                right: minSliderSize + width - xScroll,
                left: minSliderSize
              }}
              zIndex={105}
              position={{ x: scrollHandleWidth, y: 0 }}
              axis="x"
              onStart={(e, { x }) => {
                this.x = x;
              }}
              onStop={(e, { x }) => {
                const deltaX = this.x - x;
                const newSliderSize = scrollHandleWidth - deltaX;
                //user is resizing to the right so we need to update the scroll percentage so the slider does not jump
                const newScrollPercent = xScroll / (width - newSliderSize);
                onSizeAdjust(newSliderSize, newScrollPercent);
              }}
            >
              <div
                style={{
                  height: minimapTracksPartialHeight || 0,
                  // height: "100%",
                  border: "none",
                  cursor: "ew-resize",
                  opacity: "1",
                  top: "0px",
                  // right: 0,
                  position: "absolute",
                  zIndex: "10",
                  width: 2,
                  background: "black"
                }}
                className="minimapCaret"
              />
            </Draggable>
          </div>
        </Draggable>
      );
    }
  }
);

export function getTrimmedRangesToDisplay({ trimmedRange, seqLen }) {
  if (!trimmedRange) return [];
  const inverted = invertRange(trimmedRange, seqLen);
  return splitRangeIntoTwoPartsIfItIsCircular(inverted, seqLen);
}
