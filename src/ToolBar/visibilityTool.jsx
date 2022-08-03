import { Icon, Menu } from "@blueprintjs/core";
import React from "react";
import { createCommandMenu } from "teselagen-react-components";
import viewSubmenu from "../MenuBar/viewSubmenu";
import getCommands from "../commands";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";
import withEditorProps from "../withEditorProps";

export default connectToEditor(({ toolBar = {} }) => {
  return {
    isOpen: toolBar.openItem === "visibilityTool"
  };
})(({ toolbarItemProps, isOpen }) => {
  return (
    <ToolbarItem
      {...{
        Icon: <Icon icon="eye-open" />,
        onIconClick: "toggleDropdown",
        Dropdown: VisibilityOptions,
        noDropdownIcon: true,
        toggled: isOpen,
        tooltip: isOpen ? "Hide Visibility Options" : "Show Visibility Options",
        ...toolbarItemProps
      }}
    />
  );
});

const VisibilityOptions = withEditorProps(function(props) {
  return (
    <Menu>
      {createCommandMenu(viewSubmenu, getCommands({ props }), {
        useTicks: true,
        omitIcons: true
      })}
    </Menu>
  );
});
