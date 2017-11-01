import React from "react";
import { Icon, IconClasses } from "@blueprintjs/core";

export default ({ onSave = () => {} }) => {
  return {
    Icon: <Icon iconName={IconClasses.FLOPPY_DISK} />,
    onIconClick: onSave,
    tooltip: "Save"
  };
};
