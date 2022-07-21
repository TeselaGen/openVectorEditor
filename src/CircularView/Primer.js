import React from "react";
import { getStripedPattern } from "../utils/editorUtils";
import drawDirectedPiePiece from "./drawDirectedPiePiece";

export default function CircularPrimer({
  color = "orange",
  radius,
  arrowheadLength = 0.5,
  annotationHeight,
  totalAngle,
  id
}) {
  const path = drawDirectedPiePiece({
    radius,
    annotationHeight,
    totalAngle,
    arrowheadLength,
    tailThickness: 1 //feature specific
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
    </React.Fragment>
  );
}
