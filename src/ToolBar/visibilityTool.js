import { Icon, Menu } from "@blueprintjs/core";
import React from "react";
import { createMenu } from "teselagen-react-components";
import viewSubmenu from "../MenuBar/viewSubmenu";
import {
  applyCommandsToMenu,
  addMenuTexts,
  addMenuTicks
} from "../utils/__temp_menuUtils";
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
      {createMenu(
        addMenuTicks(
          addMenuTexts(
            applyCommandsToMenu(viewSubmenu, getCommands({ props }), {
              useTicks: true,
              omitIcons: true
            })
          )
        )
      )}
    </Menu>
  );
}
