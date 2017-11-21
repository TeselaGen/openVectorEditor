import React from "react";
import { Icon, IconClasses } from "@blueprintjs/core";

export default {
  updateKeys: ["findTool", "toggleFindTool"],
  itemProps: ({ findTool = {}, toggleFindTool }) => {
    return {
      Icon: <Icon iconName={IconClasses.SEARCH} />,
      toggled: findTool.isOpen,
      onIconClick: toggleFindTool,
      tooltip: findTool.isOpen ? (
        <span>
          Hide Find Tool <span style={{ fontSize: 10 }}>(Cmd/Ctrl+F)</span>
        </span>
      ) : (
        <span>
          Show Find Tool <span style={{ fontSize: 10 }}>(Cmd/Ctrl+F)</span>
        </span>
      )
    };
  }
};
