// import download from 'in-browser-download'
import {
  Popover,
  Position,
  Tooltip,
  Icon as BpIcon,
  AnchorButton,
  Intent
} from "@blueprintjs/core";
import React from "react";
import withEditorProps from "../withEditorProps";
import "./style.css";

export default class ToolbarItem extends React.Component {
  toggleDropdown = () => {
    const { index, toggleOpen } = this.props;
    toggleOpen(index);
  };

  render() {
    const { overrides = {} } = this.props;
    const {
      isOpen,
      index,
      Icon,
      // dynamicIcon,
      onIconClick = noop,
      tooltip = "",
      tooltipToggled,
      dropdowntooltip = "",
      Dropdown: _DropDown,
      disabled,
      renderIconAbove,
      noDropdownIcon,
      IconWrapper,
      popoverDisabled,
      IconWrapperProps,
      dropdownicon,
      tooltipDisabled,
      toggled = false
    } = { ...this.props, ...overrides };

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
    const Dropdown = _DropDown && withEditorProps && withEditorProps(_DropDown);

    const buttonTarget = (
      <div className={"veToolbarItemOuter " + (disabled ? " disabled " : "")}>
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
            <Tooltip
              disabled={tooltipDisabled}
              portalClassName="ve-toolbar-item-popover"
              content={tooltipToDisplay}
            >
              <AnchorButton
                intent={Intent.PRIMARY}
                onClick={onIconClick}
                active={toggled}
                disabled={disabled}
                minimal
                icon={
                  React.isValidElement(Icon) ? (
                    Icon
                  ) : (
                    <Icon toggleDropdown={this.toggleDropdown} />
                  )
                }
              />
            </Tooltip>
          )}
        {Dropdown && !noDropdownIcon ? (
          <Tooltip disabled={tooltipDisabled} content={dropdowntooltip}>
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
                <BpIcon iconSize={13} icon={"caret-up"} />
              ) : (
                <BpIcon iconSize={13} icon={"caret-down"} />
              )}
            </div>
          </Tooltip>
        ) : null}
      </div>
    );
    const content = (
      <div
        ref={n => {
          if (n) this.dropdownNode = n;
        }}
        style={{ padding: 10, minWidth: 250, maxWidth: 350 }}
        className={"ve-toolbar-dropdown content"}
      >
        {Dropdown && (
          <Dropdown {...this.props} toggleDropdown={this.toggleDropdown} />
        )}
      </div>
    );
    const target = IconWrapper ? (
      <IconWrapper {...IconWrapperProps}> {buttonTarget}</IconWrapper>
    ) : (
      buttonTarget
    );

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {index !== 0 && <div className="veToolbarSpacer" />}
        {popoverDisabled ? (
          target
        ) : (
          <Popover
            disabled={true || popoverDisabled}
            isOpen={!popoverDisabled && !!Dropdown && isOpen}
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
            }}
            canEscapeKeyClose
            minimal
            position={Position.BOTTOM}
            target={target}
            content={content}
          />
        )}
      </div>
    );
  }
}

function noop() {}
