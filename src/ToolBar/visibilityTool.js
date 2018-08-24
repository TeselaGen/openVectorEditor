import { Icon, Menu } from "@blueprintjs/core";
import React from "react";
import { createCommandMenu } from "../utils/__temp_menuUtils";
import viewSubmenu from "../MenuBar/viewSubmenu";
import getCommands from "../commands";

export default {
  updateKeys: ["isOpen", "toggleDropdown"],
  itemProps: ({ isOpen, toggleDropdown }) => {
    return {
      Icon: <Icon icon="eye-open" />,
      onIconClick: toggleDropdown,
      Dropdown: VisibilityOptions,
      noDropdownIcon: true,
      toggled: isOpen,
      tooltip: isOpen ? "Hide Visibility Options" : "Show Visibility Options"
    };
  }
};

function VisibilityOptions(props) {
  return (
    <Menu>
      {createCommandMenu(viewSubmenu, getCommands({ props }), {
        useTicks: true,
        omitIcons: true
      })}
    </Menu>
  );
}
