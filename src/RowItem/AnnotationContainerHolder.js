import React from "react";

let AnnotationContainerHolder = function(props) {
  return (
    <div
      className={props.className || "annotationContainer"}
      width="100%"
      style={{
        height: props.containerHeight,
        position: "relative",
        display: "block",
        marginTop: props.marginTop,
        marginBottom: props.marginBottom
      }}
    >
      {props.children}
    </div>
  );
};
export default AnnotationContainerHolder;
