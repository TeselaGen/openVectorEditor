import React from "react";
import { Icon } from "@blueprintjs/core";
import FindBar from "../FindBar";

export default {
  updateKeys: ["findTool", "toggleFindTool"],
  itemProps: ({ findTool = {}, editorName, toggleFindTool }) => {
    return {
      Icon: !findTool.isOpen ? (
        <Icon icon="search" />
      ) : (
        <FindBar editorName={editorName} isInline />
      ),
      // toggled: findTool.isOpen,
      renderIconAbove: findTool.isOpen,
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
