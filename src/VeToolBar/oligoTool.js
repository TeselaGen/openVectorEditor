import { Icon } from "@blueprintjs/core";
import React from "react";
// import show_primers from "./veToolbarIcons/show_primers.png";

export default ({ annotationVisibilityToggle, annotationVisibility = {} }) => {
  return {
    Icon: (
      <Icon
        onClick={function() {
          annotationVisibilityToggle("primers");
        }}
        iconName={"swap-horizontal"}
      />
    ),
    toggled: annotationVisibility.primers,
    tooltip: "Show oligos",
    tooltipToggled: "Hide oligos",
    id: "oligoTool"
  };
};

// function OligoTool({ annotationVisibilityToggle }) {
//   return (
//     <div
//       onClick={function() {
//         annotationVisibilityToggle("primers");
//       }}
//     >
//       <img src={show_primers} alt="Show oligos" />
//     </div>
//   );
// }
