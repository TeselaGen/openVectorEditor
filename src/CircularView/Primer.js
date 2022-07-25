import React from "react";
import { getStripedPattern } from "../utils/editorUtils";
import drawDirectedPiePiece from "./drawDirectedPiePiece";
import { getInternalLabel } from "./getInternalLabel";

export default function CircularPrimer(props) {
  const {
    color = "orange",
    radius,
    arrowheadLength = 0.5,
    annotationHeight,
    totalAngle,
    id,
    labelNeedsFlip,
    ellipsizedName
  } = props;
  const [path, textPath] = drawDirectedPiePiece({
    radius,
    annotationHeight,
    totalAngle,
    arrowheadLength,
    tailThickness: 1, //feature specific
    returnTextPath: true,
    hasLabel: ellipsizedName,
    labelNeedsFlip
  });
  return (
    <React.Fragment>
      {getStripedPattern({ color })}
      <path
        className="vePrimer veCircularViewPrimer"
        id={id}
        strokeWidth=".5"
        stroke="black"
        fill="url(#diagonalHatch)"
        d={path.print()}
      />
      {getInternalLabel({ ...props, colorToUse: color, textPath })}
    </React.Fragment>
  );
}
