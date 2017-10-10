import React from "react";
import {Icon, IconClasses} from '@blueprintjs/core';

export default ({sequenceData}) => {
  return {
    Icon: <Icon iconName={IconClasses.FLOPPY_DISK}></Icon>,
    // onIconClick: 
    tooltip: "Save",
    id: "save"
  };
};
