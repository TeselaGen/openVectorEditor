import React from "react";

class AnnotationPositioner extends React.PureComponent {
  render() {
    return (
      <svg
        transform={this.props.transform || null}
        height={this.props.height + 5}
        className={this.props.className + " veRowViewAnnotationPosition"}
        width={this.props.width + 5}
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
