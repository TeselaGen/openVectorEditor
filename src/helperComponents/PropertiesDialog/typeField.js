import React from "react";
import { getFeatureToColorMap } from "ve-sequence-utils";

export const typeField = {
  path: "type",
  type: "string",
  render: (name, { color }) => {
    const colorToUse =
      color || getFeatureToColorMap({ includeHidden: true })[name];
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            height: 20,
            width: 20,
            background: colorToUse,
            marginRight: 3
          }}
        />
        {name}
      </div>
    );
  }
};
