import React from "react";

class AnnotationPositioner extends React.PureComponent {
  render() {
    return (
      <svg
        data-y-offset={this.props.yOffset}
        transform={this.props.transform || null}
        height={`${Math.max(0, this.props.height)}px`}
        className={
          (this.props.className || "") + " veRowViewAnnotationPosition"
        }
        width={Math.max(0, this.props.width + 5)}
        style={{
          position: "absolute",
          top: this.props.top,
          left: this.props.left
        }}
      >
        {this.props.children}
      </svg>
    );
  }
}
export default AnnotationPositioner;

// key={'feature' + annotation.id + 'start:' + annotationRange.start}
