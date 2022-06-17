import React from "react";
import { SequenceName } from "./LinearView/SequenceName";
import classNames from "classnames";

export function SimpleOligoPreview({
  className,
  width,
  height,
  sequenceData,
  showTitle
}) {
  return (
    <div
      style={{
        width,
        height,
        paddingLeft: 5,
        display: "flex",
        flexDirection: "column"
      }}
      className={classNames("tg-simple-oligo-viewer", className)}
    >
      {showTitle && (
        <SequenceName
          {...{
            isProtein: sequenceData.isProtein,
            sequenceName: sequenceData.name || "",
            sequenceLength: sequenceData.sequence
              ? sequenceData.sequence.length
              : 0
          }}
        />
      )}
      <div style={{ height: "100%", overflow: "auto", wordBreak: "break-all" }}>
        {sequenceData.sequence || ""}
      </div>
    </div>
  );
}
