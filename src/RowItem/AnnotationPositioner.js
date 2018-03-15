import React from "react";

let AnnotationPositioner = function(props) {
  return (
    <svg
      transform={props.transform || null}
      height={props.height + 5}
      className={props.className + " veRowViewAnnotationPosition"}
      width={props.width + 5}
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
