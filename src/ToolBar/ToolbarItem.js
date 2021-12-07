import { connectToEditor } from "../withEditorProps";
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
import "./style.css";

class ToolbarItem extends React.Component {
  toggleDropdown = ({ forceClose } = {}) => {
    const { toolName, isOpen } = this.props;

    this.props.openToolbarItemUpdate(isOpen || forceClose ? "" : toolName);
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
      Dropdown,
      disabled,
      isHidden,
      renderIconAbove,
      noDropdownIcon,
      IconWrapper,
      editorName,
      popoverDisabled,
      IconWrapperProps,
      toolName,
      dropdownicon,
      tooltipDisabled,
      toggled = false,
      ...rest
    } = { ...this.props, ...overrides };
    if (!toolName) console.warn("toolName is required!");
    if (isHidden) return null;
    let tooltipToDisplay = tooltip;
    if (toggled && tooltipToggled) {
      tooltipToDisplay = tooltipToggled;
    }
    // const Dropdown = _DropDown && withEditorProps && withEditorProps(_DropDown);

    const buttonTarget = (
      <div
        className={
          `veToolbarItemOuter ve-tool-container-${toolName}` +
          (disabled ? " disabled " : "")
        }
      >
        {renderIconAbove && (
          <div>
            <div className="veToolbarItem">{Icon}</div>
          </div>
        )}

        {Icon && !renderIconAbove && (
          <Tooltip
            disabled={tooltipDisabled}
            portalClassName="ve-toolbar-item-popover"
            content={tooltipToDisplay}
          >
            <AnchorButton
              intent={Intent.PRIMARY}
              onClick={
                onIconClick === "toggleDropdown"
                  ? this.toggleDropdown
                  : onIconClick
              }
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
                <div className="veToolbarIcon">
                  <div>{dropdownicon}</div>
                </div>
              ) : isOpen ? (
                <BpIcon
                  data-test={toolName + "Dropdown"}
                  iconSize={13}
                  icon="caret-up"
                />
              ) : (
                <BpIcon
                  data-test={toolName + "Dropdown"}
                  iconSize={13}
                  icon="caret-down"
                />
              )}
            </div>
          </Tooltip>
        ) : null}
      </div>
    );
    const content = (
      <div
        ref={(n) => {
          if (n) this.dropdownNode = n;
        }}
        style={{ padding: 10, minWidth: 250, maxWidth: 350 }}
        className="ve-toolbar-dropdown content"
      >
        {Dropdown && (
          <Dropdown
            {...rest}
            editorName={editorName}
            toggleDropdown={this.toggleDropdown}
          />
        )}
      </div>
    );
    const target = IconWrapper ? (
      <IconWrapper {...IconWrapperProps}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {buttonTarget}
          </div>
        )}
      </IconWrapper>
    ) : (
      buttonTarget
    );

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {index !== 0 && <div className="veToolbarSpacer" />}

        <Popover
          disabled={popoverDisabled}
          isOpen={!!Dropdown && isOpen}
          onClose={(e) => {
            let srcElement;
            if (e) {
              srcElement = e.srcElement || e.target;
            }
            if (
              e &&
              srcElement &&
              this.dropdownNode &&
              (this.dropdownNode.contains(srcElement) ||
                !document.body.contains(srcElement))
            ) {
              return;
            }
            this.toggleDropdown({ forceClose: true });
          }}
          canEscapeKeyClose
          minimal
          position={Position.BOTTOM}
          target={target}
          content={content}
        />
      </div>
    );
  }
}

function noop() {}

export default connectToEditor(({ toolBar = {} }, { toolName }) => ({
  isOpen: toolBar.openItem === toolName
}))(ToolbarItem);
