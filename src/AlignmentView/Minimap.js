import React from "react";
import Draggable from "react-draggable";
import ReactList from "react-list";
import Axis from "../RowItem/Axis";
import getXStartAndWidthFromNonCircularRange from "../RowItem/getXStartAndWidthFromNonCircularRange";
import { view } from "react-easy-state";

export default class Minimap extends React.Component {
  shouldComponentUpdate(newProps) {
    const { props } = this;
    if (
      ["numBpsShownInLinearView", "scrollAlignmentView"].some(
        key => props[key] !== newProps[key]
      )
    )
      return true;
    return false;
  }
  handleMinimapClick = e => {
    if (e.target && e.target.classList.contains("minimapCaret")) {
      e.stopPropagation();
      return;
    }
    const {
      onMinimapScroll,
      laneHeight,
      handleScrollToTrack,
      dimensions: { width = 200 }
    } = this.props;
    const scrollHandleWidth = this.getScrollHandleWidth();
    const percent =
      (this.getXPositionOfClickInMinimap(e) - scrollHandleWidth / 2) /
      (width - scrollHandleWidth);
    onMinimapScroll(percent);

    const y = this.getYPositionOfClickInMinimap(e);
    const trackIndex = Math.floor(y / laneHeight);
    handleScrollToTrack(trackIndex);
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

  handleDrag = e => {
    const {
      onMinimapScroll,
      dimensions: { width = 200 }
    } = this.props;
    const percent = this.getXPositionOfClickInMinimap(e) / width;
    onMinimapScroll(percent);
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
    matchHighlightRanges.forEach(range => {
      const { xStart, width } = getXStartAndWidthFromNonCircularRange(
        range,
        charWidth
      );
      const height = laneHeight - laneSpacing;
      const y = 0;
      const toAdd = ` M${xStart},${y} L${xStart + width},${y} L${xStart +
        width},${y + height} L${xStart},${y + height} `;
      if (range.isMatch) {
        greyPath += toAdd;
      } else {
        redPath += toAdd;
      }
    });
    return (
      <div
        key={i + "-lane"}
        style={{ height: laneHeight, maxHeight: laneHeight }}
      >
        <svg style={{ display: "block" }} height={laneHeight} width={width}>
          <path d={redPath} fill={"red"} />
          <path d={greyPath} fill={"grey"} />
        </svg>
      </div>
    );
  };

  render() {
    const {
      alignmentTracks = [],
      dimensions: { width = 200 },
      style = {},
      laneHeight,
      onSizeAdjust,
      minSliderSize,
      onMinimapScroll,
      easyStore
    } = this.props;

    const [template /* ...nonTemplates */] = alignmentTracks;
    const seqLength = template.alignmentData.sequence.length;
    const charWidth = this.getCharWidth();
    const scrollHandleWidth = this.getScrollHandleWidth();

    return (
      <div
        ref={ref => (this.minimap = ref)}
        className={"alignmentMinimap"}
        style={{ position: "relative", width, overflowY: "hidden", ...style }}
        onClick={this.handleMinimapClick}
      >
        <div
          ref={ref => {
            if (ref) {
              this.minimapTracks = ref;
            }
          }}
          style={{
            maxHeight: 250,
            overflowY: "auto",
            position: "relative"
          }}
          className={"alignmentMinimapTracks"}
        >
          <YellowScrollHandle
            width={width}
            handleDrag={this.handleDrag}
            onMinimapScroll={onMinimapScroll}
            minSliderSize={minSliderSize}
            onSizeAdjust={onSizeAdjust}
            easyStore={easyStore} //we use react-easy-state here to prevent costly setStates from being called
            scrollHandleWidth={scrollHandleWidth}
            alignmentTracks={alignmentTracks}
            laneHeight={laneHeight}
            minimapTracksPartialHeight={laneHeight * alignmentTracks.length}
          />
          <ReactList
            type={"uniform"}
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
        minSliderSize,
        laneHeight,
        onSizeAdjust,
        minimapTracksPartialHeight
      } = this.props;
      const { verticalVisibleRange, percentScrolled } = easyStore;

      const xScroll = percentScrolled * (width - scrollHandleWidth);

      return (
        <Draggable
          bounds={"parent"}
          zIndex={105}
          handle=".handle"
          position={{ x: xScroll, y: 0 }}
          axis={"x"}
          // onStart={this.onStart}
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
              axis={"x"}
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
                className={"minimapCaret"}
              />
            </Draggable>
            {/* the actual handle component */}
            <div
              className={"syncscroll handle"}
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
                className={"verticalScrollDisplay"}
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
              axis={"x"}
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
                className={"minimapCaret"}
              />
            </Draggable>
          </div>
        </Draggable>
      );
    }
  }
);
