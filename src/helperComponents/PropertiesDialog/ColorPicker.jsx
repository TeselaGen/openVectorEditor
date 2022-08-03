import React from "react";
import { map } from "lodash";
import { Button } from "@blueprintjs/core";

export default class ColorPicker extends React.Component {
  render() {
    const { onColorSelect } = this.props;
    return (
      <div style={{ display: "flex", padding: 20, maxWidth: 300 }}>
        {["red", "blue", "green", "yellow", "pink"].map(color => {
          const isSelected = color === "blue";
          return (
            <div
              onClick={() => {
                onColorSelect(color);
              }}
              key={color}
              style={{
                margin: 10,
                height: 20,
                width: 20,
                padding: 3,
                background: color,
                ...(isSelected && { border: "1px solid black" })
              }}
            />
          );
        })}
      </div>
    );
  }
}
