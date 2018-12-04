import React from "react";
import { Icon, Menu } from "@blueprintjs/core";
import { createCommandMenu } from "teselagen-react-components";
import getCommands from "../commands";

import { connectToEditor } from "../withEditorProps";
import ToolbarItem from "./ToolbarItem";
import withEditorProps from "../withEditorProps";

export default connectToEditor()(({ toolbarItemProps }) => {
  return (
    <ToolbarItem
      {...{
        tooltip: "Export",
        Dropdown,
        noDropdownIcon: true,
        onIconClick: "toggleDropdown",
        Icon: <Icon data-test="veDownloadTool" icon="import" />,
        ...toolbarItemProps
      }}
    />
  );
});

const Dropdown = withEditorProps(props => {
  return (
    <Menu>
      {createCommandMenu(
        [
          "exportSequenceAsGenbank",
          "exportSequenceAsFasta",
          "exportSequenceAsTeselagenJson"
        ],
        getCommands({ props })
      )}
    </Menu>
  );
});
