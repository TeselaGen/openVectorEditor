import React from "react";
import { Icon, IconClasses } from "@blueprintjs/core";

export default {
  updateKeys: ["findTool", "toggleFindTool"],
  itemProps: ({ findTool = {}, toggleFindTool }) => {
    return {
      Icon: <Icon iconName={IconClasses.SEARCH} />,
      toggled: findTool.isOpen,
      onIconClick: toggleFindTool,
      tooltip: findTool.isOpen ? "Hide Find Tool" : "Show Find Tool"
    };
  }
};
