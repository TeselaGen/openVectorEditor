// import download from 'in-browser-download'
import DropDownIcon from "react-icons/lib/md/arrow-drop-down";
import DropUpIcon from "react-icons/lib/md/arrow-drop-up";
import { Popover, Position, Tooltip as Tooltip2 } from "@blueprintjs/core";
import React from "react";
import withEditorProps from "../withEditorProps";
import "./style.css";

export default class ToolbarItem extends React.Component {
  toggleDropdown = () => {
    const { index, toggleOpen } = this.props;
    toggleOpen(index);
  };

  render() {
    const {
      isOpen,
      index,
      Icon,
      editorName,
      onIconClick = noop,
      tooltip = "",
      tooltipToggled,
      dropdowntooltip = "",
      Dropdown: _DropDown,
      disabled,
      noDropdownIcon,
      dropdownicon,
      toggled = false
    } = this.props;
    // const {
    //   Icon,
    //   onIconClick = noop,
    //   tooltip = "",
    //   tooltipToggled,
    //   dropdowntooltip = "",
    //   Dropdown,
    //   disabled,
    //   noDropdownIcon,
    //   dropdownicon,
    //   toggled = false
    // } = item({ isOpen, toggleDropdown: this.toggleDropdown });

    let tooltipToDisplay = tooltip;
    if (toggled && tooltipToggled) {
      tooltipToDisplay = tooltipToggled;
    }
    const Dropdown = _DropDown && withEditorProps(_DropDown);
    return (
      <div>
        <Popover
          isOpen={!!Dropdown && isOpen}
          onClose={e => {
            if (e.keyCode === 27) {
              this.toggleDropdown();
            }
          }}
          position={Position.BOTTOM}
          target={
            <div
              className={"veToolbarItemOuter " + (disabled ? " disabled " : "")}
            >
              {Icon && (
                <Tooltip2
                  portalClassName="ve-toolbar-item-popover"
                  useSmartPositioning
                  content={tooltipToDisplay}
                >
                  <div
                    onClick={disabled ? noop : onIconClick}
                    className={" veToolbarItem"}
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
                        <Icon toggleDropdown={this.toggleDropdown} />
                      )}
                    </div>
                  </div>
                </Tooltip2>
              )}
              {Dropdown && !noDropdownIcon ? (
                <Tooltip2 useSmartPositioning content={dropdowntooltip}>
                  <div
                    className={
                      (isOpen ? " isOpen " : "") +
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
                </Tooltip2>
              ) : null}
            </div>
          }
          content={
            <div
              style={{ padding: 10, minWidth: 250, maxWidth: 350 }}
              className={"ve-toolbar-dropdown content"}
            >
              {Dropdown && (
                <Dropdown
                  editorName={editorName}
                  toggleDropdown={this.toggleDropdown}
                />
              )}
            </div>
          }
        />
      </div>
    );
  }
}

function noop() {}
