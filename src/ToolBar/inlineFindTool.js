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
          <div>
            <Icon data-test="ve-find-tool-toggle" icon="search" />
            <Icon icon="caret-right" />
          </div>
        ) : (
          <FindBar editorName={editorName} />
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
