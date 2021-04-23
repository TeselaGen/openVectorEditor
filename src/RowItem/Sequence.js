import React from "react";
import { times, map } from "lodash";
import { DNAComplementMap } from "ve-sequence-utils";
import { view } from "@risingstack/react-easy-state";
import { getVisibleStartEnd } from "../utils/getVisibleStartEnd";

const getChunk = (sequence, chunkSize, chunkNumber) =>
  sequence.slice(chunkSize * chunkNumber, chunkSize * (chunkNumber + 1));
const realCharWidth = 8;
class Sequence extends React.Component {
  render() {
    let {
      sequence,
      hideBps,
      charWidth,
      containerStyle = {},
      children,
      isReverse,
      height,
      className,
      startOffset = 0,
      chunkSize = 100,
      scrollData,
      showDnaColors,
      // getGaps,
      alignmentData
    } = this.props;
    // the fudge factor is used to position the sequence in the middle of the <text> element
    const fudge = charWidth - realCharWidth;
    let gapsBeforeSequence = 0;
    let seqReadWidth = 0;
    const seqLen = sequence.length;

    if (alignmentData) {
      // gapsBeforeSequence = getGaps(0).gapsBefore;
      // sequence = sequence.replace(/-/g, " ")
      // seqReadWidth = charWidth * sequence.length;
    }
    let style = {
      position: "relative",
      height,
      left: gapsBeforeSequence * charWidth,
      ...containerStyle
    };

    let width = seqLen * charWidth;
    let coloredRects = null;
    if (showDnaColors) {
      coloredRects = <ColoredSequence {...{ ...this.props, width }} />;
    }
    const numChunks = Math.ceil(seqLen / chunkSize);
    const chunkWidth = chunkSize * charWidth;
    if (scrollData) {
      //we're in the alignment view alignments only
      const { visibleStart, visibleEnd } = getVisibleStartEnd({
        scrollData,
        width
      });

      return (
        <div
          style={style}
          className={(className ? className : "") + " ve-row-item-sequence"}
        >
          {!hideBps && (
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
              {times(numChunks, (i) => {
                const seqChunk = getChunk(sequence, chunkSize, i);

                const textLength = charWidth * seqChunk.length;
                const x = i * chunkWidth;
                if (x > visibleEnd || x + textLength < visibleStart)
                  return null;
                return (
                  <text
                    key={i}
                    className={
                      "ve-monospace-font " +
                      (isReverse ? " ve-sequence-reverse" : "")
                    }
                    {...{
                      textLength: textLength - fudge,
                      x: x + fudge / 2,
                      y: height - height / 4,
                      lengthAdjust: "spacing"
                    }}
                  >
                    {seqChunk}
                  </text>
                );
              })}
            </svg>
          )}
          {coloredRects}
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
                  textLength: (alignmentData ? seqReadWidth : width) - fudge
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

export default view(Sequence);

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
        (key) => props[key] !== newProps[key]
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
        `M${x},${y} L${x + width},${y} L${x + width},${y + height} L${x},${
          y + height
        }`;
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
