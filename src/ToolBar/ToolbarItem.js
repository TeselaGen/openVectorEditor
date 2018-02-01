// import download from 'in-browser-download'
import DropDownIcon from "react-icons/lib/md/arrow-drop-down";
import DropUpIcon from "react-icons/lib/md/arrow-drop-up";
import { Popover, Position, Tooltip as Tooltip2 } from "@blueprintjs/core";
// import { Popover2 as Popover } from "@blueprintjs/labs";
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
      dynamicIcon,
      onIconClick = noop,
      tooltip = "",
      tooltipToggled,
      dropdowntooltip = "",
      Dropdown: _DropDown,
      disabled,
      renderIconAbove,
      noDropdownIcon,
      dropdownicon,
      tooltipDisabled,
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
            if (
              e.srcElement &&
              this.dropdownNode &&
              (this.dropdownNode.contains(e.srcElement) ||
                !document.body.contains(e.srcElement))
            ) {
              return;
            }
            this.toggleDropdown();
            // if (e.keyCode === 27) {
            //   this.toggleDropdown();
            // }
          }}
          minimal
          position={Position.BOTTOM}
          target={
            <div
              className={"veToolbarItemOuter " + (disabled ? " disabled " : "")}
            >
              {renderIconAbove && (
                <div>
                  <div className={"veToolbarItem"}>
                    {index !== 0 && <div className={"veToolbarSpacer"} />}

                    {Icon}
                  </div>
                </div>
              )}

              {Icon &&
                !renderIconAbove && (
                  <Tooltip2
                    isDisabled={tooltipDisabled}
                    portalClassName="ve-toolbar-item-popover"
                    tetherOptions={{
                      constraints: [
                        { attachment: "together", to: "scrollParent" }
                      ]
                    }}
                    content={tooltipToDisplay}
                  >
                    <div
                      onClick={disabled ? noop : onIconClick}
                      className={"veToolbarItem"}
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
                <Tooltip2
                  tetherOptions={{
                    constraints: [
                      { attachment: "together", to: "scrollParent" }
                    ]
                  }}
                  content={dropdowntooltip}
                >
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
              ref={n => {
                if (n) this.dropdownNode = n;
              }}
              // onClick={e => {
              //   e.stopPropagation();
              //   e.preventDefault();
              // }}
              style={{ padding: 10, minWidth: 250, maxWidth: 350 }}
              className={"ve-toolbar-dropdown content"}
            >
              {Dropdown && (
                <Dropdown
                  {...this.props}
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
