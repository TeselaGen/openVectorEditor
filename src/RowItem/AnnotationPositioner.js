import { observer } from "mobx-react";
import React from "react";

const AnnotationPositioner = (props) => {
  return (
    <svg
      data-y-offset={props.yOffset}
      transform={props.transform || null}
      height={`${Math.max(0, props.height)}px`}
      className={(props.className || "") + " veRowViewAnnotationPosition"}
      width={Math.max(0, props.width + 5)}
      style={{
        position: "absolute",
        top: props.top,
        left: props.left
      }}
    >
      {props.children}
    </svg>
  );
};
export default AnnotationPositioner;

// key={'feature' + annotation.id + 'start:' + annotationRange.start}
