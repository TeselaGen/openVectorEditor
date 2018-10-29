import React from "react";
import { Icon, Menu } from "@blueprintjs/core";
import { createCommandMenu } from "teselagen-react-components";
import getCommands from "../commands";

export default {
  updateKeys: ["toggleDropdown"],
  itemProps: props => {
    return {
      tooltip: "Export",
      Dropdown,
      noDropdownIcon: true,
      onIconClick: props.toggleDropdown,
      Icon: <Icon icon="import" />
    };
  }
};

const Dropdown = props => {
  return (
    <Menu>
      {createCommandMenu(
        ["exportSequenceAsGenbank", "exportSequenceAsFasta"],
        getCommands({ props })
      )}
    </Menu>
  );
};
