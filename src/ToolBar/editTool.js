import { Icon } from "@blueprintjs/core";
import React from "react";

export default {
  updateKeys: ["readOnly", "toggleReadOnlyMode"],
  itemProps: ({ readOnly, toggleReadOnlyMode }) => {
    return {
      Icon: <Icon icon={readOnly ? "lock" : "unlock"} />,
      onIconClick: toggleReadOnlyMode,
      tooltip: readOnly ? (
        <span>
          Switch to edit mode <span style={{ fontSize: 10 }}>(Cmd/Ctrl+E)</span>
        </span>
      ) : (
        <span>
          Switch to read only mode{" "}
          <span style={{ fontSize: 10 }}>(Cmd/Ctrl+E)</span>
        </span>
      )
    };
  }
};
