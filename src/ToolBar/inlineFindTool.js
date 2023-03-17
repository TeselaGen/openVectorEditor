import React from "react";
import { Icon } from "@blueprintjs/core";
import FindBar from "../FindBar";
import ToolbarItem from "./ToolbarItem";

export default ({ed, toolbarItemProps}) => {
  const isOpen =  ed.findTool.isOpen
  return (
    <ToolbarItem
      {...{ed,
        Icon: !isOpen ? (
          <div>
            <Icon data-test="ve-find-tool-toggle" icon="search" />
            <Icon icon="caret-right" />
          </div>
        ) : (
          <FindBar ed={ed} />
        ),
        renderIconAbove: isOpen,
        onIconClick: ed.findTool.toggleFindTool,
        tooltip: isOpen ? (
          <span>
            Hide Find Tool <span style={{ fontSize: 10 }}>(Cmd/Ctrl+F)</span>
          </span>
        ) : (
          <span>
            Show Find Tool <span style={{ fontSize: 10 }}>(Cmd/Ctrl+F)</span>
          </span>
        ),
        ...toolbarItemProps
      }}
    />
  );
}