import React from "react";
import { Icon, IconClasses } from "@blueprintjs/core";

export default {
  updateKeys: ["handleSave", "readOnly", "hasBeenSaved"],
  itemProps: ({ hasBeenSaved, readOnly, handleSave = () => {} }) => {
    return {
      Icon: <Icon iconName={IconClasses.FLOPPY_DISK} />,
      onIconClick: handleSave,
      disabled: hasBeenSaved || readOnly,
      tooltip: (
        <span>
          Save <span style={{ fontSize: 10 }}>(Cmd/Ctrl+S)</span>
        </span>
      )
    };
  }
};
