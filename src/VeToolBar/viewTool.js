import React from "react";
import {Radio} from '@blueprintjs/core';
import fullscreen from "./veToolbarIcons/fullscreen.png";

export default ({toggleDropdown}) => {
  return {
    Dropdown: ViewToolDropdown,
    Icon: <img src={fullscreen} alt="Toggle Views" />,
    onIconClick: toggleDropdown,
    tooltip: "Toggle Views",
    noDropIcon: true,
    id: "toggleViews"
  }
};

function ViewToolDropdown({ panelsShown, panelsShownUpdate }) {
  return (
    <div className={"veToolbarViewOptionsHolder"}>
      <div>Show View:</div>
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
