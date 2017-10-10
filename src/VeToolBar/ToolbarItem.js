// import download from 'in-browser-download'
import DropDownIcon from "react-icons/lib/md/arrow-drop-down";
import DropUpIcon from "react-icons/lib/md/arrow-drop-up";
// import Popover from "react-popover2";
import { Popover, Position } from "@blueprintjs/core";
// import Popover from "react-popover";
import React from "react";
// import get from 'lodash/get'
import "./style.css";

export default class ToolbarItem extends React.Component {
  toggleDropdown = () => {
    const { index, toggleOpen } = this.props;
    toggleOpen(index);
  };

  render() {
    const { item, isOpen, index, ...rest } = this.props;
    const {
      Icon,
      onIconClick = noop,
      tooltip = "",
      tooltipToggled,
      dropdowntooltip = "",
      Dropdown,
      noDropdownIcon,
      dropdownicon,
      toggled = false
    } = item({ ...rest, isOpen, toggleDropdown: this.toggleDropdown });
    
    let tooltipToDisplay = tooltip;
    if (toggled && tooltipToggled) {
      tooltipToDisplay = tooltipToggled;
    }
    return (
      <div>
        <Popover
          isOpen={!!Dropdown && isOpen}
          position={Position.BOTTOM}
          target={
            <div className={"veToolbarItemOuter"}>
              {Icon && (
                <div
                  onClick={onIconClick}
                  aria-label={tooltipToDisplay}
                  className={" hint--bottom-left veToolbarItem"}
                >
                  {index !== 0 && <div className={"veToolbarSpacer"} />}
                  <div
                    className={
                      "veToolbarIcon " +
                      (toggled ? " veToolbarItemToggled" : "")
                    }
                  >
                    {React.isValidElement(Icon) ? (
                      Icon
                    ) : (
                      <Icon {...rest} toggleDropdown={this.toggleDropdown} />
                    )}
                  </div>
                </div>
              )}
              {(Dropdown &&
              !noDropdownIcon) ? (
                <div
                  aria-label={dropdowntooltip}
                  className={
                    (isOpen ? ' isOpen ' : '') +
                    " hint--bottom-left " +
                    (dropdownicon ? "" : " veToolbarDropdown")
                  }
                  onClick={this.toggleDropdown}
                >
                  {dropdownicon ? (
                    <div className={"veToolbarIcon"}>
                      <div>{dropdownicon}</div>
                    </div>
                  ) : isOpen ? (
                    <DropUpIcon style={{ width: 20, height: 20 }} />
                  ) : (
                    <DropDownIcon style={{ width: 20, height: 20 }} />
                  )}
                </div>
              ) : null}
            </div>
          }
          content={
            <div
              style={{ padding: 10, minWidth: 250, maxWidth: 350 }}
              className={"ve-toolbar-dropdown content"}
            >
              {Dropdown && <Dropdown {...rest} toggleDropdown={this.toggleDropdown} />}
            </div>
          }
        />
      </div>
    );
  }
}

function noop() {}
