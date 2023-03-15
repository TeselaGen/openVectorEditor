import React from "react";

export function SequenceName({ ed }) {
  return (
    <div key="circViewSvgCenterText" style={{ textAlign: "center" }}>
      <span>{ed.name} </span>
      <br />
      <span>
        {ed.isProtein
          ? `${Math.floor(ed.sequenceLength / 3)} AAs`
          : `${ed.sequenceLength} bps`}
      </span>
    </div>
  );
}
