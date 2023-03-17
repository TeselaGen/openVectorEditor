import { Icon } from "@blueprintjs/core";
import React from "react";
import {
  orfIcon,
  CmdCheckbox,
  CmdDiv,
  InfoHelper
} from "teselagen-react-components";
import ToolbarItem from "./ToolbarItem";
import getCommands from "../commands";

export default ({ toolbarItemProps, ed }) => {
  const toggled = ed.annotationVisibility.orfs;
  const isOpen = ed.openToolbarItem === "orfTool";
  return (
    <ToolbarItem
      {...{ed,
        Icon: <Icon data-test="orfTool" icon={orfIcon} />,
        onIconClick: function () {
          ed.annotationVisibility.annotationVisibilityToggle("orfs");
        },
        toggled,
        tooltip: "Show Open Reading Frames",
        tooltipToggled: "Hide Open Reading Frames",
        Dropdown: OrfToolDropdown,
        dropdowntooltip:
          (!isOpen ? "Show" : "Hide") + " Open Reading Frame Options",
        ...toolbarItemProps
      }}
    />
  );
};

class OrfToolDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.commands = getCommands(this);
  }
  render() {
    return (
      <div className="veToolbarOrfOptionsHolder">
        <CmdCheckbox prefix="Show " cmd={this.commands.toggleOrfTranslations} />
        <CmdCheckbox
          prefix="Show "
          cmd={this.commands.useGtgAndCtgAsStartCodons}
        />
        <CmdDiv cmd={this.commands.minOrfSizeCmd} />
        <div className="vespacer" />

        <InfoHelper
          displayToSide
          content="To translate an arbitrary area, right click a selection."
        />
      </div>
    );
  }
}
