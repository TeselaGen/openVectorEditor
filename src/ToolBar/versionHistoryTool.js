import React from "react";
import { Icon } from "@blueprintjs/core";

export default {
  updateKeys: ["toggleViewVersionHistory", "lastEdit", "hasBeenSaved"],
  itemProps: ({ toggleViewVersionHistory = () => {} }) => {
    return {
      Icon: <Icon icon="history" />,
      onIconClick: toggleViewVersionHistory,
      // disabled: hasBeenSaved || lastEdit,
      tooltip: (
        <span>
          View Version History
        </span>
      )
    };
  }
};
