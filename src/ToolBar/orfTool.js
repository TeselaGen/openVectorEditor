import { Icon } from "@blueprintjs/core";
import React from "react";
import { Checkbox, Classes } from "@blueprintjs/core";
// import show_orfs from "./veToolbarIcons/show_orfs.png";
import { orfIcon, InfoHelper } from "teselagen-react-components";
import classNames from "classnames";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";
import withEditorProps from "../withEditorProps";
import selectors from "../selectors";

export default connectToEditor(
  ({ annotationVisibility = {}, toolBar = {} }) => {
    return {
      toggled: annotationVisibility.orfs,
      isOpen: toolBar.openItem === "orfTool"
    };
  }
)(({ toolbarItemProps, toggled, annotationVisibilityToggle, isOpen }) => {
  return (
    <ToolbarItem
      {...{
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
          (!isOpen ? "Show" : "Hide") + " Open Reading Frame Options",
        ...toolbarItemProps
      }}
    />
  );
});

const OrfToolDropdown = withEditorProps(function({
  useAdditionalOrfStartCodons,
  useAdditionalOrfStartCodonsToggle,
  annotationVisibility,
  annotationVisibilityToggle,
  editorName
}) {
  return (
    <div className="veToolbarOrfOptionsHolder">
      <div className="vespacer" />
      <MinOrfSize editorName={editorName} />
      <Checkbox
        onChange={function() {
          annotationVisibilityToggle("orfTranslations");
        }}
        disabled={!annotationVisibility.orfs}
        checked={annotationVisibility.orfTranslations}
        label="Show translations for ORFs"
      />
      <Checkbox
        onChange={function() {
          annotationVisibilityToggle("cdsFeatureTranslations");
        }}
        checked={annotationVisibility.cdsFeatureTranslations}
        label="Show translations for CDS features"
      />
      <Checkbox
        onChange={useAdditionalOrfStartCodonsToggle}
        checked={useAdditionalOrfStartCodons}
        label="Use GTG and CTG as start codons"
      />
      <div className="vespacer" />

      <InfoHelper
        displayToSide
        content="To translate an arbitrary area, right click a selection."
      />
    </div>
  );
});

export const MinOrfSize = connectToEditor(editorState => {
  return {
    sequenceLength: selectors.sequenceLengthSelector(editorState),
    minimumOrfSize: editorState.minimumOrfSize
  };
})(
  ({
    minimumOrfSizeUpdate,
    sequenceLength,
    annotationVisibilityShow,
    minimumOrfSize
  }) => {
    return (
      <div data-test="min-orf-size" style={{ display: "flex" }}>
        Minimum ORF Size:
        <input
          type="number"
          className={classNames(Classes.INPUT, "minOrfSizeInput")}
          onChange={function(event) {
            let minimumOrfSize = parseInt(event.target.value, 10);
            if (!(minimumOrfSize > -1)) return;
            if (minimumOrfSize > sequenceLength) return;
            annotationVisibilityShow("orfs");
            minimumOrfSizeUpdate(minimumOrfSize);
          }}
          value={minimumOrfSize}
        />
      </div>
    );
  }
);
