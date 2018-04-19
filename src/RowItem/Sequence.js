import React from "react";
import { times } from "lodash";

const getChunk = (sequence, chunkSize, chunkNumber) =>
  sequence.slice(chunkSize * chunkNumber, chunkSize * (chunkNumber + 1));

class Sequence extends React.Component {
  render() {
    let {
      sequence,
      charWidth,
      containerStyle = {},
      children,
      length,
      height,
      className,
      startOffset = 0,
      chunkSize = 100,
      scrollData
    } = this.props;
    let width = length * charWidth;
    let style = {
      position: "relative",
      height,
      ...containerStyle
    };
    const seqLen = sequence.length;
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
          {children}
        </div>
      );
    }
  }
}

export default Sequence;
