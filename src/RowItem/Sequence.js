import React from "react";
import { times, map } from "lodash";
import { DNAComplementMap } from "ve-sequence-utils";

const getChunk = (sequence, chunkSize, chunkNumber) =>
  sequence.slice(chunkSize * chunkNumber, chunkSize * (chunkNumber + 1));
const realCharWidth = 8;
class Sequence extends React.Component {
  shouldComponentUpdate(newProps) {
    const { props } = this;
    if (
      [
        "hideBps",
        "cutsites",
        "sequence",
        "showCutsites",
        "charWidth",
        "length",
        "height",
        "width",
        "isReverse",
        "scrollData",
        "showDnaColors"
      ].some(key => props[key] !== newProps[key])
    )
      return true;
    if (!!props.alignmentData !== !!newProps.alignmentData) return true;
    return false;
  }
  render() {
    let {
      sequence,
      hideBps,
      charWidth,
      containerStyle = {},
      children,
      isReverse,
      length,
      height,
      className,
      startOffset = 0,
      chunkSize = 100,
      scrollData,
      showDnaColors,
      getGaps,
      alignmentData
    } = this.props;
    // const fudge = 0
    const fudge = charWidth - realCharWidth; // the fudge factor is used to position the sequence in the middle of the
    // const fudge = charWidth * 0.4; // the fudge factor is used to position the sequence in the middle of the
    let gapsBeforeSequence = 0;
    let seqReadWidth = 0;
    if (alignmentData) {
      gapsBeforeSequence = getGaps(0).gapsBefore;
      sequence = sequence.replace(/^-+/g, "").replace(/-+$/g, "");
      seqReadWidth = charWidth * sequence.length;
    }
    let style = {
      position: "relative",
      height,
      left: gapsBeforeSequence * charWidth,
      display: alignmentData ? "inline-block" : "",
      ...containerStyle
    };
    let width = length * charWidth;
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
            height={Math.max(0, Number(height))}
          >
            {times(numChunks, i => {
              const seqChunk = getChunk(sequence, chunkSize, i);

              const textLength = charWidth * seqChunk.length - fudge;
              const x = i * chunkWidth;

              if (x > visibleEnd || x + textLength < visibleStart) return null;
              return (
                <text
                  key={i}
                  className={
                    "ve-monospace-font " +
                    (isReverse ? " ve-sequence-reverse" : "")
                  }
                  {...{
                    // x: i * chunkWidth + i/2 * charWidth ,
                    // textLength: charWidth * seqChunk.length - charWidth,
                    x,
                    textLength: alignmentData ? seqReadWidth : textLength,
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
          className={(className ? className : "") + " ve-row-item-sequence"}
        >
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
              height={Math.max(0, Number(height))}
            >
              <text
                className={
                  "ve-monospace-font " +
                  (isReverse ? " ve-sequence-reverse" : "")
                }
                {...{
                  x: 0 + fudge / 2,
                  y: height - height / 4,
                  textLength: (alignmentData ? seqReadWidth : width) - fudge,
                  lengthAdjust: "spacing"
                }}
              >
                {sequence}
              </text>
            </svg>
          )}
          {coloredRects}
          {children}
        </div>
      );
    }
  }
}

export default Sequence;
const dnaToColor = {
  a: "lightgreen",
  c: "#658fff",
  g: "yellow",
  t: "#EE6262"
};

function getDnaColor(char, isReverse) {
  return (
    dnaToColor[
      isReverse ? DNAComplementMap[char.toLowerCase()] : char.toLowerCase()
    ] || "lightgrey"
  );
}

class ColoredSequence extends React.Component {
  shouldComponentUpdate(newProps) {
    const { props } = this;
    if (
      ["charWidth", "sequence", "height", "isReverse", "width"].some(
        key => props[key] !== newProps[key]
      )
    )
      return true;
    if (!!props.alignmentData !== !!newProps.alignmentData) return true;
    return false;
  }
  drawRects = () => {
    let { charWidth, sequence, height, isReverse, alignmentData } = this.props;
    if (alignmentData) {
      sequence = sequence.replace(/^-+/g, "").replace(/-+$/g, "");
    }
    //we use big paths instead of many individual rects to improve performance
    const colorPaths = Object.values(dnaToColor).reduce((acc, color) => {
      acc[color] = "";
      return acc;
    }, {});

    sequence.split("").forEach((char, i) => {
      const width = charWidth;
      const x = i * charWidth;
      const y = 0;
      colorPaths[getDnaColor(char, isReverse)] =
        (colorPaths[getDnaColor(char, isReverse)] || "") +
        `M${x},${y} L${x + width},${y} L${x + width},${y + height} L${x},${y +
          height}`;
    });
    return (
      <g>
        {map(colorPaths, (d, color) => {
          return <path key={color} d={d} fill={color} />;
        })}
      </g>
    );
  };
  render() {
    const { height } = this.props;
    // if (sequence.length > 100000) return null
    return (
      <svg style={{ display: "block" }} height={Math.max(0, Number(height))}>
        {this.drawRects()}
      </svg>
    );
  }
}
