import React from "react";
import {Radio} from '@blueprintjs/core';
import fullscreen from "./veToolbarIcons/fullscreen.png";

export default ({toggleDropdown, isOpen}) => {
  return {
    Dropdown: ViewToolDropdown,
    Icon: <img src={fullscreen} alt="Toggle Views" />,
    onIconClick: toggleDropdown,
    tooltip: isOpen ? "Hide View Options" : "Show View Options",
    noDropdownIcon: true,
    id: "toggleViews"
  }
};

function ViewToolDropdown({ panelsShown, panelsShownUpdate }) {
  return (
    <div className={"veToolbarViewOptionsHolder"}>
      <div>View:</div>
      <Radio
        style={{marginTop: 6, marginBottom: 6}}
        onChange={() => {
          panelsShownUpdate({
            circular: true,
            sequence: false
          });
        }}
        checked={panelsShown.circular && !panelsShown.sequence}
        label="Circular"
      />
      <Radio
        style={{marginTop: 6, marginBottom: 6}}
        onChange={() => {
          panelsShownUpdate({
            circular: false,
            sequence: true
          });
        }}
        checked={panelsShown.sequence && !panelsShown.circular}
        label="Sequence"
      />
      <Radio
        style={{marginTop: 6, marginBottom: 6}}
        onChange={() => {
          panelsShownUpdate({
            circular: true,
            sequence: true
          });
        }}
        checked={panelsShown.sequence && panelsShown.circular}
        label="Both"
      />
    </div>
  );
}
