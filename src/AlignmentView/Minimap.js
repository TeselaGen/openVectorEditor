import React from "react";
import Draggable from "react-draggable";
import ReactList from "@teselagen/react-list";
import Axis from "../RowItem/Axis";
import getXStartAndWidthFromNonCircularRange from "../RowItem/getXStartAndWidthFromNonCircularRange";
import { view } from "react-easy-state";

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
      ].some(key => props[key] !== newProps[key])
    )
      return true;
    return false;
  }
  handleMinimapClick = e => {
    if (
      this.isDragging ||
      (e.target && e.target.classList.contains("minimapCaret"))
    ) {
      e.stopPropagation();
      return;
    }
    const {
      onMinimapScrollX,
      laneHeight,
      scrollYToTrack,
      dimensions: { width = 200 }
    } = this.props;
    const scrollHandleWidth = this.getScrollHandleWidth();
    const percent =
      (this.getXPositionOfClickInMinimap(e) - scrollHandleWidth / 2) /
      (width - scrollHandleWidth);
    onMinimapScrollX(percent);

    //scroll vertically
    const y = this.getYPositionOfClickInMinimap(e);
    const trackIndex = Math.floor(y / laneHeight);
    scrollYToTrack(trackIndex);
  };

  getCharWidth = () => {
    const {
      alignmentTracks = [],
      dimensions: { width = 200 }
    } = this.props;
    const [template] = alignmentTracks;
    const seqLength = template.alignmentData.sequence.length;
    const charWidth = Math.min(16, width / seqLength);
    return charWidth || 12;
  };
  getScrollHandleWidth = () => {
    const { numBpsShownInLinearView, dimensions } = this.props;
    const charWidth = this.getCharWidth();
    const { width } = getXStartAndWidthFromNonCircularRange(
      { start: 0, end: Math.max(numBpsShownInLinearView - 1, 0) },
      charWidth
    );
    return Math.min(width, dimensions.width);
  };
  getXPositionOfClickInMinimap = e => {
    const leftStart = this.minimap.getBoundingClientRect().left;
    return Math.max(e.clientX - leftStart, 0);
  };
  getYPositionOfClickInMinimap = e => {
    const topStart = this.minimap.getBoundingClientRect().top;
    return Math.max(e.clientY + this.minimapTracks.scrollTop - topStart, 0);
  };
  handleDragStop = () => {
    setTimeout(() => {
      this.isDragging = false;
    }, 150);
  };
  handleDrag = e => {
    const {
      onMinimapScrollX,
      dimensions: { width = 200 }
    } = this.props;
    this.isDragging = true; //needed to block erroneous click events from being triggered!
    const percent = this.getXPositionOfClickInMinimap(e) / width;
    onMinimapScrollX(percent);
  };
  itemSizeGetter = () => {
    return this.props.laneHeight;
  };
  renderItem = i => {
    const {
      alignmentTracks = [],
      dimensions: { width = 200 },
      laneHeight,
      laneSpacing = 1
    } = this.props;
    const charWidth = this.getCharWidth();

    const { matchHighlightRanges } = alignmentTracks[i];
    //need to get the chunks that can be rendered
    let redPath = ""; //draw these as just 1 path instead of a bunch of rectangles to improve browser performance
    let greyPath = "";
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
    greyPath += `M${firstRange.xStart},${y} L${lastRange.xStart +
      lastRange.width},${y} L${lastRange.xStart + lastRange.width},${y +
      height} L${firstRange.xStart},${y + height}`;
    matchHighlightRanges.forEach(range => {
      const { xStart, width } = getXStartAndWidthFromNonCircularRange(
        range,
        charWidth
      );
      const toAdd = `M${xStart},${y} L${xStart + width},${y} L${xStart +
        width},${y + height} L${xStart},${y + height}`;
      if (!range.isMatch) {
        redPath += toAdd;
      }
    });
    return (
      <div
        key={i + "-lane"}
        style={{ height: laneHeight, maxHeight: laneHeight }}
      >
        <svg
          height={laneHeight}
          width={width}
          shapeRendering="geometricPrecision"
        >
          <path d={greyPath} fill="grey" />
          <path d={redPath} fill="red" />
        </svg>
      </div>
    );
  };

  render() {
    const {
      alignmentTracks = [],
      dimensions: { width = 200 },
      laneHeight,
      onSizeAdjust,
      minSliderSize,
      onMinimapScrollX,
      easyStore
    } = this.props;

    const [template /* ...nonTemplates */] = alignmentTracks;
    const seqLength = template.alignmentData.sequence.length;
    const charWidth = this.getCharWidth();
    const scrollHandleWidth = this.getScrollHandleWidth();

    return (
      <div
        ref={ref => (this.minimap = ref)}
        className="alignmentMinimap"
        style={{
          position: "relative",
          width,
          overflowX: "visible",
          overflowY: "hidden"
        }}
        onClick={this.handleMinimapClick}
      >
        <div
          ref={ref => {
            if (ref) {
              this.minimapTracks = ref;
            }
          }}
          style={{
            maxHeight: 150,
            overflowY: "auto",
            position: "relative"
          }}
          className="alignmentMinimapTracks"
        >
          <YellowScrollHandle
            width={width}
            handleDrag={this.handleDrag}
            handleDragStop={this.handleDragStop}
            onMinimapScrollX={onMinimapScrollX}
            minSliderSize={minSliderSize}
            onSizeAdjust={onSizeAdjust}
            easyStore={easyStore} //we use react-easy-state here to prevent costly setStates from being called
            scrollHandleWidth={scrollHandleWidth}
            alignmentTracks={alignmentTracks}
            laneHeight={laneHeight}
            minimapTracksPartialHeight={laneHeight * alignmentTracks.length}
          />
          <ReactList
            itemsRenderer={(items, ref) => (
              <div style={{ marginTop: -3 }} ref={ref}>
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
            tickSpacing: Math.floor(seqLength / 10),
            bpsPerRow: seqLength,
            charWidth,
            annotationHeight: 15,
            sequenceLength: seqLength
          }}
        />
      </div>
    );
  }
}
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
              className="handle"
              dataname="scrollGroup"
              style={{
                height: minimapTracksPartialHeight || 0,
                border: "none",
                cursor: "move",
                opacity: ".3",
                zIndex: "10",
                width: scrollHandleWidth,
                background: "yellow"
              }}
            >
              {/* this is the blue vertical scroll position display element */}
              <div
                className="verticalScrollDisplay"
                style={{
                  height:
                    (verticalVisibleRange.end -
                      verticalVisibleRange.start +
                      1) *
                    laneHeight,

                  zIndex: "-10",
                  background: "blue",
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
                onSizeAdjust(newSliderSize);

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
