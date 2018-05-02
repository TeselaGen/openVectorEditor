import React from "react";
import Draggable from "react-draggable";
import Axis from "../RowItem/Axis";
import getXStartAndWidthFromNonCircularRange from "../RowItem/getXStartAndWidthFromNonCircularRange";
import { view } from "react-easy-state";

export default class Minimap extends React.Component {
  handleMinimapClick = e => {
    if (e.target && e.target.classList.contains("minimapCaret")) {
      e.stopPropagation();
      return;
    }
    const { onMinimapScroll, dimensions: { width = 200 } } = this.props;
    const scrollHandleWidth = this.getScrollHandleWidth();

    const percent =
      (this.getXPositionOfClickInMinimap(e) - scrollHandleWidth / 2) /
      (width - scrollHandleWidth);
    onMinimapScroll(percent);
  };
  getXPositionOfClickInMinimap = e => {
    const leftStart = this.minimap.getBoundingClientRect().left;
    return Math.max(e.clientX - leftStart, 0);
  };

  getCharWidth = () => {
    const { alignmentTracks = [], dimensions: { width = 200 } } = this.props;
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

  render() {
    const {
      alignmentTracks = [],
      dimensions: { width = 200 },
      style = {},
      laneHeight = 17,
      laneSpacing = 3,
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
        style={{ position: "relative", width, ...style }}
        onMouseDown={this.handleMinimapClick}
      >
        <YellowScrollHandle
          width={width}
          onMinimapScroll={onMinimapScroll}
          minSliderSize={minSliderSize}
          onSizeAdjust={onSizeAdjust}
          easyStore={easyStore} //we use react-easy-state here to prevent costly setStates from being called
          scrollHandleWidth={scrollHandleWidth}
        />
        <div style={{ maxHeight: 150, overflowY: "auto" }}>
          <svg height={alignmentTracks.length * laneHeight} width={width}>
            {alignmentTracks.map(({ matchHighlightRanges }, i) => {
              //need to get the chunks that can be rendered
              return matchHighlightRanges.map((range, index) => {
                const { xStart, width } = getXStartAndWidthFromNonCircularRange(
                  range,
                  charWidth
                );
                return (
                  <rect
                    key={i + "-" + index}
                    y={laneHeight * i}
                    height={laneHeight - laneSpacing}
                    fill={range.isMatch ? "grey" : "red"}
                    {...{ x: xStart, width }}
                  />
                );
              });
            })}
          </svg>
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
    onDrag = (e, { deltaX }) => {
      const { scrollHandleWidth, width, onMinimapScroll } = this.props;
      const scrollPercentage = this.props.easyStore.percentScrolled;

      const minimapX = scrollPercentage * (width - scrollHandleWidth);
      const percent = (deltaX + minimapX) / (width - scrollHandleWidth);
      onMinimapScroll(percent);
    };

    render() {
      const {
        scrollHandleWidth,
        width,
        easyStore,
        onMinimapScroll,
        minSliderSize,
        onSizeAdjust
      } = this.props;
      const xScroll = easyStore.percentScrolled * (width - scrollHandleWidth);

      return (
        <Draggable
          bounds={"parent"}
          zIndex={105}
          handle=".handle"
          position={{ x: xScroll, y: 0 }}
          axis={"x"}
          onDrag={this.onDrag}
        >
          <div
            style={{
              height: "100%",
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
                onSizeAdjust(newSliderSize);
                //user is resizing to the left so we need to update the scroll percentage so the slider does not jump
                const newScrollPercent = Math.min(
                  1,
                  (xScroll + deltaX) / (width - newSliderSize)
                );
                onMinimapScroll(newScrollPercent);
                easyStore.percentScrolled = newScrollPercent;
                // setTimeout(() => {
                // })
              }}
            >
              <div
                style={{
                  height: "100%",
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
              dataName="scrollGroup"
              style={{
                height: "100%",
                border: "none",
                cursor: "move",
                opacity: ".3",
                zIndex: "10",
                width: scrollHandleWidth,
                background: "yellow"
              }}
            />
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
                onMinimapScroll(newScrollPercent);
                easyStore.percentScrolled = newScrollPercent;
                // setTimeout(() => {
                // })
              }}
            >
              <div
                style={{
                  height: "100%",
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

function stopProp(e) {
  e.stopPropagation();
}
