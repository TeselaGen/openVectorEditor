import React from "react";

export default function Cutsite({
  annotationHeight,
  radius
  // totalAngle,
  // ...rest
}) {
  return (
    <rect
      className={"veCutsite"}
      width={1}
      y={-radius - 4}
      height={annotationHeight}
      // {...rest}
    />
  );
}
