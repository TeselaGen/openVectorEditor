import { Icon, Button, KeyCombo } from "@blueprintjs/core";
import CutsiteFilter from "../CutsiteFilter";
import React from "react";
import ToolbarItem from "./ToolbarItem";
import { userDefinedHandlersAndOpts } from "../Editor/userDefinedHandlersAndOpts";
import { pick } from "lodash";
import { observer } from "mobx-react";

export default observer(({ toolbarItemProps, ed }) => {
  return (
    <ToolbarItem
      {...{
        Icon: <Icon data-test="cutsiteHideShowTool" icon="cut" />,
        onIconClick: function () {
          ed.annotationVisibility.annotationVisibilityToggle("cutsites");
        },
        toggled: ed.annotationVisibility.cutsites,
        tooltip: "Show cut sites",
        tooltipToggled: "Hide cut sites",
        Dropdown: CutsiteToolDropDown,
        dropdowntooltip:
          (!ed.openToolbarItem === "cutsiteTool" ? "Show" : "Hide") +
          " Cut Site Options",
        ...toolbarItemProps
      }}
    />
  );
});

function CutsiteToolDropDown({
  ed,
  toggleDropdown,
  withDigestTool,

}) {
  return (
    <div className="veToolbarCutsiteFilterHolder">
      <h6>
        Filter Cut Sites{" "}
        <span style={{ fontSize: 12, color: "grey" }}>
          (Search by name or # of cuts)
        </span>
      </h6>
      <CutsiteFilter
        ed={ed}
        onChangeHook={function () {
          ed.annotationVisibilityShow("cutsites");
        }}
        closeDropDown={toggleDropdown}
      />
      {withDigestTool && (
        <Button
          onClick={() => {
            ed.panelsShown.createNewDigest();
            toggleDropdown();
          }}
        >
          <span style={{ display: "flex" }}>
            Virtual Digest &nbsp; <KeyCombo minimal combo="mod+shift+d" />
          </span>
        </Button>
      )}
    </div>
  );
}
