import React from "react";

const AnnotationContainerHolder = function (props) {
  return (
    <div
      className={props.className || "annotationContainer"}
      width="100%"
      style={{
        height: props.containerHeight,
        position: "relative",
        display: "block",
        marginTop: props.marginTop + props.extraMargin,
        marginBottom: props.marginBottom
      }}
    >
      {props.children}
    </div>
  );
};
export default AnnotationContainerHolder;
