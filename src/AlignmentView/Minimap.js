import React from "react";
import { getRangeLength } from "ve-range-utils/lib";
import Draggable from "react-draggable";
import Axis from "../RowItem/Axis";
import SelectionLayer from "../RowItem/SelectionLayer";

const laneHeight = 20;
export default class Minimap extends React.Component {
  onDrag = (e, { x }) => {
    const { onMinimapScroll, dimensions: { width = 200 } } = this.props;
    const scrollHandle = this.getScrollHandleWidthAndXStart();
    const percent = x / (width - scrollHandle.width);
    onMinimapScroll(percent);
  };
  onDragEnd = event => {
    if (!event.clientX) {
      return;
    }
    let boundingRect = this.refs.circularView.getBoundingClientRect();
    //get relative click positions
    // let clickX = event.clientX - boundingRect.left - boundingRect.width / 2;
    // let clickY = event.clientY - boundingRect.top - boundingRect.height / 2;

    let rowNotFound = true;
    //loop through all the rendered rows to see if the click event lands in one of them
    let nearestCaretPos = 0;
    let rowDomNode = this.minimap;
    let boundingRowRect = rowDomNode.getBoundingClientRect();
    if (
      event.clientY > boundingRowRect.top &&
      event.clientY < boundingRowRect.top + boundingRowRect.height
    ) {
      //then the click is falls within this row
      rowNotFound = false;
      // let row = rowData[0];
      // if (event.clientX - boundingRowRect.left < 0) {
      //   nearestCaretPos = row.start;
      // } else {
      //   let clickXPositionRelativeToRowContainer =
      //     event.clientX - boundingRowRect.left;
      //   let numberOfBPsInFromRowStart = Math.floor(
      //     (clickXPositionRelativeToRowContainer + this.charWidth / 2) /
      //       this.charWidth
      //   );
      //   nearestCaretPos = numberOfBPsInFromRowStart + row.start;
      //   if (nearestCaretPos > row.end + 1) {
      //     nearestCaretPos = row.end + 1;
      //   }
      // }
    }

    if (rowNotFound) {
      // var { top, bottom } = rowDomNode.getBoundingClientRect();
      // var numbers = [top, bottom];
      // var target = event.clientY;
      // var topOrBottom = numbers
      //   .map(function(value, index) {
      //     return [Math.abs(value - target), index];
      //   })
      //   .sort()
      //   .map(function(value) {
      //     return numbers[value[1]];
      //   })[0];

      nearestCaretPos = 0;
    }
  };

  getCharWidth = () => {
    const { alignment = [], dimensions: { width = 200 } } = this.props;
    const [template] = alignment;
    const seqLength = template.sequenceData.sequence.length;
    const charWidth = Math.min(16, width / seqLength);
    return charWidth;
  };
  getScrollHandleWidthAndXStart = () => {
    const {
      numBpsShownInLinearView = 20,
      percentScrolled,
      dimensions
    } = this.props;
    const charWidth = this.getCharWidth();
    const { width } = getWidthAndXStartFromRange(
      { start: 0, end: Math.max(numBpsShownInLinearView - 1, 0) },
      charWidth
    );
    const x = percentScrolled * ((dimensions.width || 200) - width);
    return {
      width,
      x
    };
  };

  render() {
    const { alignment = [], dimensions: { width = 200 } } = this.props;
    const [template, ...nonTemplates] = alignment;
    const seqLength = template.sequenceData.sequence.length;
    const charWidth = this.getCharWidth();
    const scrollHandle = this.getScrollHandleWidthAndXStart();

    return (
      <div
        ref={ref => (this.minimap = ref)}
        className={"alignmentMinimap"}
        style={{ position: "relative" }}
      >
        <Draggable
          bounds={"parent"}
          zIndex={105}
          position={{ x: scrollHandle.x, y: 0 }}
          // start={{ x: scrollHandle.x, y: 0 }}
          axis={"x"}
          onDrag={this.onDrag}
          // onStop={this.onDragEnd}
        >
          <div
            style={{
              height: "100%",
              border: "none",
              // background: '#0099ff',
              opacity: ".3",
              top: "0px",
              position: "absolute",
              zIndex: "10",
              width: scrollHandle.width,
              background: "yellow"
            }}
          />
        </Draggable>

        <svg height={alignment.length * laneHeight} width={width}>
          {alignment.map(({ sequenceData, matchHighlightRanges }, i) => {
            //need to get the chunks that can be rendered

            return matchHighlightRanges.map((range, index) => {
              const { x, width } = getWidthAndXStartFromRange(range, charWidth);
              return (
                <rect
                  key={i + "-" + index}
                  y={laneHeight * i}
                  height={laneHeight - 3}
                  fill={range.isMatch ? "grey" : "red"}
                  {...{ x, width }}
                />
              );
            });
          })}
        </svg>
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

function getWidthAndXStartFromRange(range, charWidth, sequenceLength) {
  const rangeLength = getRangeLength(range);
  return {
    width: rangeLength * charWidth,
    x: range.start * charWidth
  };
}
