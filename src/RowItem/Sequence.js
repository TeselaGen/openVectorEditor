import React from "react";
import { times, map } from "lodash";
import { view } from "@risingstack/react-easy-state";
import { getVisibleStartEnd } from "../utils/getVisibleStartEnd";
import { fudge2, realCharWidth } from "./constants";
import dnaToColor, { getDnaColor } from "../constants/dnaToColor";
import { hoveredAnnEasyStore } from "../helperComponents/withHover";
import {
  getOverlapsOfPotentiallyCircularRanges,
  getRangeLength,
  normalizeRange
} from "ve-range-utils";
import { partOverhangs } from "./partOverhangs";

const getChunk = (sequence, chunkSize, chunkNumber) =>
  sequence.slice(chunkSize * chunkNumber, chunkSize * (chunkNumber + 1));

class Sequence extends React.Component {
  render() {
    const {
      isReplacementLayer,
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
      fivePrimeThreePrimeHints,
      alignmentData,
      sequenceLength,
      rowStart,
      rowEnd,
      getGaps
    } = this.props;

    // the fudge factor is used to position the sequence in the middle of the <text> element
    const fudge = charWidth - realCharWidth;
    const gapsBeforeSequence = 0;
    const seqReadWidth = 0;

    const rowSeqLen = sequence.length;
    let overhangsToDraw;

    [hoveredAnnEasyStore.hoveredAnn, hoveredAnnEasyStore.selectedAnn].forEach(
      (ann, i) => {
        const isHovered = i === 0;
        if (ann && !isReplacementLayer) {
          partOverhangs.forEach((h) => {
            if (ann[h]) {
              if (h.includes("Underhang") && !isReverse) {
                return;
              } else if (h.includes("Overhang") && isReverse) {
                return;
              }
              let overhangRange;
              const overhangBps = ann[h];
              if (h.includes("fivePrime")) {
                overhangRange = {
                  start: ann.start - overhangBps.length,
                  end: ann.start - 1
                };
              } else {
                overhangRange = {
                  start: ann.end + 1,
                  end: ann.end + overhangBps.length
                };
              }
              const overlaps = getOverlapsOfPotentiallyCircularRanges(
                normalizeRange(overhangRange, sequenceLength),
                {
                  start: rowStart,
                  end: rowEnd
                }
              );
              if (!overlaps) return;
              overhangsToDraw = overhangsToDraw || [];
              overlaps.forEach((overlap) => {
                const rangeLength = getRangeLength(overlap, sequenceLength);
                overhangsToDraw.push({
                  isHovered,
                  start: overlap.start - rowStart,
                  end: overlap.end - rowStart,
                  overhangBps,
                  rangeLength
                });
              });
            }
          });
        }
      }
    );

    const style = {
      position: "relative",
      height,
      left: gapsBeforeSequence * charWidth,
      ...containerStyle
    };

    const width = rowSeqLen * charWidth;

    let inner;
    const shared = {
      y: height - height / 4,
      className:
        "ve-monospace-font " + (isReverse ? " ve-sequence-reverse" : "")
    };
    if (scrollData) {
      const numChunks = Math.ceil(rowSeqLen / chunkSize);
      const chunkWidth = chunkSize * charWidth;
      //we're in the alignment view alignments only
      const { visibleStart, visibleEnd } = getVisibleStartEnd({
        scrollData,
        width
      });
      inner = times(numChunks, (i) => {
        const seqChunk = getChunk(sequence, chunkSize, i);
        const textLength = charWidth * seqChunk.length;
        const x = i * chunkWidth;
        if (x > visibleEnd || x + textLength < visibleStart) return null;
        return (
          <text
            key={i}
            {...{
              ...shared,
              textLength: textLength - fudge - fudge2,
              x: x + fudge / 2,
              lengthAdjust: "spacing"
            }}
          >
            {seqChunk}
          </text>
        );
      });
    } else {
      inner = (
        <text
          {...{
            ...shared,
            x: 0 + fudge / 2,
            textLength: (alignmentData ? seqReadWidth : width) - fudge - fudge2
          }}
        >
          {sequence}
        </text>
      );
    }
    const gapsBefore = getGaps ? getGaps({ start: 0, end: 0 }).gapsBefore : 0;
    return (
      <div
        style={style}
        className={(className ? className : "") + " ve-row-item-sequence"}
      >
        {fivePrimeThreePrimeHints && (
          <div
            className={`tg-${
              isReverse ? "left" : "right"
            }-prime-direction tg-prime-direction`}
          >
            3'
          </div>
        )}
        {fivePrimeThreePrimeHints && (
          <div
            className={`tg-${
              isReverse ? "right" : "left"
            }-prime-direction tg-prime-direction`}
          >
            5'
          </div>
        )}
        {!hideBps && (
          <svg
            style={{
              left: startOffset * charWidth,
              height,
              width,
              position: "absolute"
            }}
            ref="rowViewTextContainer"
            className="rowViewTextContainer"
            height={Math.max(0, Number(height))}
          >
            {showDnaColors && (
              <ColoredSequence
                {...{
                  ...this.props,
                  fudge,
                  totalWidth: width
                }}
              />
            )}
            {overhangsToDraw &&
              overhangsToDraw.map((overhangRange, i) => (
                <Overhang
                  key={i}
                  {...{
                    ...this.props,
                    ...overhangRange,
                    gapsBefore,
                    fudge,
                    totalWidth: width
                  }}
                />
              ))}
            {inner}
          </svg>
        )}

        {children}
      </div>
    );
  }
}

export default view(Sequence);

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
    let {
      charWidth,
      sequence,
      height,
      isReverse,
      alignmentData,
      getGaps,
      fudge,
      totalWidth
    } = this.props;
    if (alignmentData) {
      sequence = sequence.replace(/^-+/g, "").replace(/-+$/g, "");
    }
    //we use big paths instead of many individual rects to improve performance
    const colorPaths = Object.values(dnaToColor).reduce((acc, color) => {
      acc[color] = "";
      return acc;
    }, {});
    const gapsBefore = getGaps ? getGaps({ start: 0, end: 0 }).gapsBefore : 0;
    sequence.split("").forEach((char, i) => {
      const width = Number(charWidth);
      const color = getDnaColor(char, isReverse);
      const x = (i + gapsBefore) * charWidth;
      const y = 0;
      colorPaths[color] =
        (colorPaths[color] || "") +
        `M${x},${y} L${x + width},${y} L${x + width},${y + height} L${x},${
          y + height
        }`;
    });
    const scalex = (totalWidth - fudge) / totalWidth;

    return (
      <g
        style={{
          transform: `scaleX(${scalex})`
        }}
      >
        {map(colorPaths, (d, color) => {
          return <path transform="tran" key={color} d={d} fill={color} />;
        })}
      </g>
    );
  };
  render() {
    return this.drawRects();
  }
}

function Overhang({
  height,
  charWidth,
  gapsBefore,
  rangeLength,
  isHovered,
  overhangBps,
  start,
  fudge
}) {
  const i = start;
  const width = Number(charWidth) * rangeLength - fudge;
  const x = (i + gapsBefore) * charWidth;
  const y = 0;
  const d = `M${x},${y} L${x + width},${y} L${x + width},${y + height} L${x},${
    y + height
  },Z`;
  return (
    <path
      data-partoverhang={overhangBps}
      style={{ zIndex: 100000000 }}
      d={d}
      stroke="purple"
      strokeWidth={isHovered ? 4 : 3}
      fill="none"
    ></path>
  );
}
