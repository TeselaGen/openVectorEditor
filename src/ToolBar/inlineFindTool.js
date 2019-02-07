import React from "react";
import { Icon } from "@blueprintjs/core";
import FindBar from "../FindBar";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";

export default connectToEditor(({ findTool = {} }) => {
  return {
    isOpen: findTool.isOpen
  };
})(({ toolbarItemProps, editorName, toggleFindTool, isOpen }) => {
  return (
    <ToolbarItem
      {...{
        Icon: !isOpen ? (
          <Icon data-test="ve-find-tool-toggle" icon="search" />
        ) : (
          <FindBar editorName={editorName} isInline />
        ),
        renderIconAbove: isOpen,
        onIconClick: toggleFindTool,
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
});
