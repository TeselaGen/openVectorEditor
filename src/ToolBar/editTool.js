import { Icon } from "@blueprintjs/core";
import React from "react";

export default {
  updateKeys: ["readOnly", "toggleReadOnlyMode"],
  itemProps: ({ readOnly, toggleReadOnlyMode }) => {
    return {
      Icon: <Icon iconName={readOnly ? "lock" : "unlock"} />,
      onIconClick: toggleReadOnlyMode,
      tooltip: readOnly ? "Switch to edit mode" : "Switch to read only mode"
    };
  }
};
