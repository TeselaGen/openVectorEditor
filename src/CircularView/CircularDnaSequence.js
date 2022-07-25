import React from "react";
import shouldFlipText from "./shouldFlipText";
import { getComplementSequenceString } from "ve-sequence-utils";
import { getDnaColor } from "../constants/dnaToColor";

export function CircularDnaSequence({
  rotationRadians,
  textHeightOffset = -5,
  annotation,
  showReverseSequence,
  showDnaColors,
  showSeqText,
  totalAngle,
  radius
}) {
  const shouldFlip = shouldFlipText(annotation.startAngle + rotationRadians);
  const getShared = ({ textHeightOffset, isReverse }) => ({
    className: `ve-monospace-font ${isReverse ? "ve-sequence-reverse" : ""}`,
    transform:
      (shouldFlip ? "rotate(180)" : "") +
      ` translate(0, ${shouldFlip ? -textHeightOffset : textHeightOffset})`,

    style: {
      fontSize: 12,
      textAnchor: "middle",
      dominantBaseline: "central"
    }
  });
  let forward = null;
  let reverse = null;
  let dnaColors = null;
  if (showSeqText) {
    forward = (
      <text
        {...getShared({
          textHeightOffset: showReverseSequence
            ? textHeightOffset - 15
            : textHeightOffset
        })}
      >
        {annotation.letter}
      </text>
    );
  }
  if (showSeqText && showReverseSequence) {
    reverse = (
      <text {...getShared({ textHeightOffset, isReverse: true })}>
        {getComplementSequenceString(annotation.letter)}
      </text>
    );
  }
  if (!showSeqText || showDnaColors) {
    const height = showReverseSequence ? 30 : 15;
    const width = Math.max(totalAngle * radius);
    dnaColors = (
      <rect
        fill={getDnaColor(annotation.letter)}
        height={height}
        width={width}
        transform={`translate(-${width / 2}, -${height - 3})`}
        className="veDnaColor"
      ></rect>
    );
  }

  return (
    <g>
      {dnaColors}
      {forward}
      {reverse}
    </g>
  );
}
