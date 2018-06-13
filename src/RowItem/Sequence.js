import React from "react";
import { times } from "lodash";
import { DNAComplementMap } from "ve-sequence-utils";

const getChunk = (sequence, chunkSize, chunkNumber) =>
  sequence.slice(chunkSize * chunkNumber, chunkSize * (chunkNumber + 1));

class Sequence extends React.Component {
  render() {
    let {
      sequence,
      hideBps,
      charWidth,
      containerStyle = {},
      children,
      length,
      height,
      className,
      startOffset = 0,
      chunkSize = 100,
      scrollData,
      showDnaColors
    } = this.props;
    let width = length * charWidth;
    let style = {
      position: "relative",
      height,
      ...containerStyle
    };
    const seqLen = sequence.length;
    let coloredRects = null;
    if (showDnaColors) {
      coloredRects = <ColoredSequence {...{ ...this.props, width }} />;
    }
    const numChunks = Math.ceil(seqLen / chunkSize);
    // const chunkWidth = width / numChunks;
    const chunkWidth = chunkSize * charWidth;
    if (scrollData) {
      const {
        fractionScrolled: { percentScrolled },
        viewportWidth
      } = scrollData;

      const visibleStart = percentScrolled * (width - viewportWidth);
      const visibleEnd = visibleStart + viewportWidth;

      return (
        <div
          style={style}
          className={(className ? className : "") + " ve-row-item-sequence"}
        >
          <svg
            style={{
              left: startOffset * charWidth,
              height,
              position: "absolute"
            }}
            ref="rowViewTextContainer"
            className="rowViewTextContainer"
            width={width}
            height={height}
          >
            {times(numChunks, i => {
              const seqChunk = getChunk(sequence, chunkSize, i);

              const fudge = charWidth * 0.4;

              const textLength = charWidth * seqChunk.length - fudge;
              const x = i * chunkWidth;

              if (x > visibleEnd || x + textLength < visibleStart) return null;
              return (
                <text
                  key={i}
                  className={"ve-monospace-font"}
                  {...{
                    // x: i * chunkWidth + i/2 * charWidth ,
                    // textLength: charWidth * seqChunk.length - charWidth,
                    x,
                    textLength,
                    y: height / 2,
                    lengthAdjust: "spacing"
                  }}
                >
                  {seqChunk}
                </text>
              );
            })}
          </svg>
          {children}
        </div>
      );
    } else {
      return (
        <div
          style={style}
          className={(className ? className : "") + " Sequence"}
        >
          {coloredRects}
          {!hideBps && (
            <svg
              style={{
                // marginTop: -height,
                left: startOffset * charWidth,
                height,
                position: "absolute"
              }}
              ref="rowViewTextContainer"
              className="rowViewTextContainer"
              width={width}
              height={height}
            >
              <text
                className={"ve-monospace-font"}
                {...{
                  x: 0,
                  y: height - height / 4,
                  textLength: width,
                  lengthAdjust: "spacing"
                }}
              >
                {sequence}
              </text>
            </svg>
          )}
          {children}
        </div>
      );
    }
  }
}

export default Sequence;
const dnaToColor = {
  a: "lightgreen",
  c: "lightblue",
  g: "yellow",
  t: "red"
};

function getDnaColor(char, isReverse) {
  return (
    dnaToColor[
      isReverse ? DNAComplementMap[char.toLowerCase()] : char.toLowerCase()
    ] || "lightgrey"
  );
}

class ColoredSequence extends React.Component {
  drawRects = () => {
    const { charWidth, sequence, height, isReverse } = this.props;
    return sequence.split("").map((char, i) => {
      return (
        <rect
          key={i}
          {...{
            width: charWidth,
            x: i * charWidth,
            y: 0,
            height,
            fill: getDnaColor(char, isReverse)
          }}
        />
      );
    });
  };
  render() {
    const { width, height } = this.props;
    // if (sequence.length > 100000) return null
    return (
      <svg
        width={width}
        height={height}
      >
        {this.drawRects()}
      </svg>
    );
  }
}
