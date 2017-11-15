import React from "react";
import { Tooltip, Button, Radio, Icon, IconClasses } from "@blueprintjs/core";

// import fullscreen from "./veToolbarIcons/fullscreen.png";

export default {
  updateKeys: ["toggleDropdown", "isOpen"],
  itemProps: ({ toggleDropdown, isOpen }) => {
    return {
      Dropdown: ViewToolDropdown,
      Icon: <Icon iconName={IconClasses.DESKTOP} />,
      onIconClick: toggleDropdown,
      toggled: isOpen,
      tooltip: isOpen ? "Hide View Options" : "Show View Options",
      noDropdownIcon: true
    };
  }
};

class ViewToolDropdown extends React.Component {
  handlePanelToggle = panelName => {
    const { panelsShown, panelsShownUpdate } = this.props;
    const isShown = panelsShown[panelName];
    if (isShown) {
      let numShown = 0;
      Object.keys(panelsShown).forEach(panel => {
        if (panelsShown[panel]) {
          numShown++;
        }
      });
      if (numShown > 1) {
        panelsShownUpdate({
          ...panelsShown,
          [panelName]: false
        });
      }
    } else {
      panelsShownUpdate({
        ...panelsShown,
        [panelName]: true
      });
    }
  };
  toggleCircular = () => {
    this.handlePanelToggle("circular");
  };
  toggleSequence = () => {
    this.handlePanelToggle("sequence");
  };
  toggleRail = () => {
    this.handlePanelToggle("rail");
  };
  render() {
    const { panelsShown } = this.props;
    return (
      <div className={"veToolbarViewOptionsHolder"}>
        <div>Toggle Views:</div>
        <div style={{ display: "flex" }}>
          <Tooltip content={"Toggle Circular View"}>
            <Button
              style={{ marginLeft: 10, marginRight: 10 }}
              onClick={this.toggleCircular}
              active={panelsShown.circular}
              iconName={"pt-icon-circle"}
            />
          </Tooltip>
          <Tooltip content={"Toggle Row View"}>
            <Button
              style={{ marginLeft: 10, marginRight: 10 }}
              onClick={this.toggleSequence}
              active={panelsShown.sequence}
              iconName={"pt-icon-list"}
            />
          </Tooltip>
          <Tooltip content={"Toggle Linear View"}>
            <Button
              style={{ marginLeft: 10, marginRight: 10 }}
              onClick={this.toggleRail}
              active={panelsShown.rail}
              iconName={"pt-icon-layout-linear"}
            />
          </Tooltip>
        </div>
      </div>
    );
  }
}
