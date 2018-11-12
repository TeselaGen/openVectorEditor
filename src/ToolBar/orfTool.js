import { Icon } from "@blueprintjs/core";
import React from "react";
import { Checkbox, Classes } from "@blueprintjs/core";
// import show_orfs from "./veToolbarIcons/show_orfs.png";
import { orfIcon, InfoHelper } from "teselagen-react-components";
import classNames from "classnames";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";
import withEditorProps from "../withEditorProps";

export default connectToEditor(editorState => {
  return {
    toggled: editorState.annotationVisibility.orfs,
    isOpen: editorState.toolBar.openItem === "orfTool"
  };
})(({ toolbarItemProps, toggled, annotationVisibilityToggle, isOpen }) => {
  return (
    <ToolbarItem
      {...{
        ...toolbarItemProps,
        Icon: <Icon icon={orfIcon} />,
        onIconClick: function() {
          annotationVisibilityToggle("orfs");
          annotationVisibilityToggle("orfTranslations");
        },
        toggled,
        tooltip: "Show Open Reading Frames",
        tooltipToggled: "Hide Open Reading Frames",
        Dropdown: OrfToolDropdown,
        dropdowntooltip:
          (!isOpen ? "Show" : "Hide") + " Open Reading Frame Options"
      }}
    />
  );
});

const OrfToolDropdown = withEditorProps(function ({
  sequenceLength,
  minimumOrfSizeUpdate,
  minimumOrfSize,
  useAdditionalOrfStartCodons,
  useAdditionalOrfStartCodonsToggle,
  annotationVisibility,
  annotationVisibilityToggle
}) {
  return (
    <div className={"veToolbarOrfOptionsHolder"}>
      <div style={{ display: "flex" }}>
        Minimum ORF Size:
        <input
          type="number"
          className={classNames(Classes.INPUT, "minOrfSizeInput")}
          onChange={function(event) {
            let minimumOrfSize = parseInt(event.target.value, 10);
            if (!(minimumOrfSize > -1)) return;
            if (minimumOrfSize > sequenceLength) return;
            minimumOrfSizeUpdate(minimumOrfSize);
          }}
          value={minimumOrfSize}
        />
      </div>
      <div className="vespacer" />
      <Checkbox
        onChange={function() {
          annotationVisibilityToggle("orfTranslations");
        }}
        disabled={!annotationVisibility.orfs}
        checked={annotationVisibility.orfTranslations}
        label={"Show translations for ORFs"}
      />
      <Checkbox
        onChange={function() {
          annotationVisibilityToggle("cdsFeatureTranslations");
        }}
        checked={annotationVisibility.cdsFeatureTranslations}
        label={"Show translations for CDS features"}
      />
      <Checkbox
        onChange={useAdditionalOrfStartCodonsToggle}
        checked={useAdditionalOrfStartCodons}
        label={"Use GTG and CTG as start codons"}
      />
      <div className="vespacer" />

      <InfoHelper
        displayToSide
        content="To translate an arbitrary area, right click a selection."
      />
    </div>
  );
})
