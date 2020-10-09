import { Icon, Button, KeyCombo } from "@blueprintjs/core";
import CutsiteFilter from "../CutsiteFilter";
import React from "react";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";

export default connectToEditor(
  ({ readOnly, annotationVisibility = {}, toolBar = {} }) => {
    return {
      readOnly,
      toggled: annotationVisibility.cutsites,
      isOpen: toolBar.openItem === "cutsiteTool"
    };
  }
)(({ toolbarItemProps, toggled, isOpen, annotationVisibilityToggle }) => {
  return (
    <ToolbarItem
      {...{
        Icon: <Icon data-test="cutsiteHideShowTool" icon="cut" />,
        onIconClick: function() {
          annotationVisibilityToggle("cutsites");
        },
        toggled,
        tooltip: "Show cut sites",
        tooltipToggled: "Hide cut sites",
        Dropdown: CutsiteToolDropDown,
        dropdowntooltip: (!isOpen ? "Show" : "Hide") + " Cut Site Options",
        ...toolbarItemProps
      }}
    />
  );
});
// import show_cut_sites_img from "./veToolbarIcons/show_cut_sites.png";

// function CutsiteToolIcon({ annotationVisibilityToggle }) {
//   return (
//     <div
//       onClick={function() {
//         annotationVisibilityToggle("cutsites");
//       }}
//     >
//       <img src={show_cut_sites_img} alt="Show cut sites" />
//     </div>
//   );
// }

function CutsiteToolDropDown({
  editorName,
  toggleDropdown,
  annotationVisibilityShow,
  withDigestTool,
  createNewDigest,
  showManageEnzymesDialog
}) {
  return (
    <div className="veToolbarCutsiteFilterHolder">
      <h6>
        Filter Cutsites{" "}
        <span style={{ fontSize: 12, color: "grey" }}>
          (Search by name or # of cuts)
        </span>
      </h6>
      <CutsiteFilter
        editorName={editorName}
        onChangeHook={function() {
          annotationVisibilityShow("cutsites");
        }}
        closeDropDown={toggleDropdown}
      />
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        onClick={() => {
          showManageEnzymesDialog({
            // inputSequenceToTestAgainst: sequenceData ? sequenceData.sequence : ""
          });
          toggleDropdown();
        }}
        style={{ fontSize: 11 }}
      >
        Manage Enzymes...
      </a>
      {withDigestTool && (
        <Button
          onClick={() => {
            createNewDigest();
            toggleDropdown();
          }}
        >
          <span style={{ display: "flex" }}>
            Virtual Digest &nbsp; <KeyCombo minimal combo="mod+shift+d" />
          </span>
        </Button>
      )}

      {/* <Button onClick={() => {

      }}> Add Additional Enzymes</Button> */}
      {/* {showDigestTool && <DigestTool></DigestTool>} */}
    </div>
  );
}
