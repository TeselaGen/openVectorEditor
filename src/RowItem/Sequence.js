import React from "react";

class Sequence extends React.Component {
  render() {
    let {
      sequence,
      charWidth,
      containerStyle = {},
      children,
      length,
      height,
      className,
      startOffset = 0
    } = this.props;
    let width = length * charWidth;
    let style = {
      position: "relative",
      height,
      ...containerStyle
    };
    let textAttrs = {
      x: 0,
      y: height,
      textLength: width,
      lengthAdjust: "spacing"
    };

    return (
      <div style={style} className={(className ? className : "") + " Sequence"}>
        <svg
          style={{
            left: startOffset * charWidth,
            height,
            position: "absolute"
          }}
          ref="rowViewTextContainer"
          className="rowViewTextContainer"
          width={width}
          height={height}
        >
          <text className={"monospaceFont"} {...textAttrs}>
            {sequence}
          </text>
        </svg>
        {children}
      </div>
    );
  }
}

export default Sequence;
