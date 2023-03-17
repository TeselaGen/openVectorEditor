import { Icon, Menu } from "@blueprintjs/core";
import React from "react";
import { createCommandMenu } from "teselagen-react-components";
import viewSubmenu from "../MenuBar/viewSubmenu";
import getCommands from "../commands";
import ToolbarItem from "./ToolbarItem";
import { observer } from "mobx-react";

export default observer(({ toolbarItemProps, ed }) => {
  const isOpen = ed.openToolbarItem === "visibilityTool";
  return (
    <ToolbarItem
      {...{
        ed,
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

const VisibilityOptions = observer(function (props) {
  return (
    <Menu>
      {createCommandMenu(viewSubmenu, getCommands({ props }), {
        useTicks: true,
        omitIcons: true
      })}
    </Menu>
  );
});
