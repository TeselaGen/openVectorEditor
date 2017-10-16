import React from "react";
import show_primers from "./veToolbarIcons/show_primers.png";

export default ({ annotationVisibility = {} }) => {
  return {
    Icon: OligoTool,
    toggled: annotationVisibility.primers,
    tooltip: "Show oligos",
    tooltipToggled: "Hide oligos",
    id: "primers"
  };
};

function OligoTool({ annotationVisibilityToggle }) {
  return (
    <div
      onClick={function() {
        annotationVisibilityToggle("primers");
      }}
    >
      <img src={show_primers} alt="Show oligos" />
    </div>
  );
}
