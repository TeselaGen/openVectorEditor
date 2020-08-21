import { Icon } from "@blueprintjs/core";
// import { Checkbox, Button } from "@blueprintjs/core";
import { TgSelect } from "teselagen-react-components";
import React from "react";
// import { connect } from "react-redux";
// import { convertRangeTo1Based } from "ve-range-utils";
//import { partIcon } from "teselagen-react-components";
import ToolbarItem from "./ToolbarItem";
import withEditorProps, { connectToEditor } from "../withEditorProps";
import { flatMap } from "lodash";

export default connectToEditor(
  ({ annotationVisibility = {}, toolBar = {} }) => {
    return {
      toggled: annotationVisibility.parts,
      isOpen: toolBar.openItem === "partTool"
    };
  }
)(({ toolbarItemProps, toggled, annotationVisibilityToggle, isOpen }) => {
  return (
    <ToolbarItem
      {...{
        Icon: <Icon icon="doughnut-chart" />,
        onIconClick: function () {
          annotationVisibilityToggle("parts");
        },
        toggled,
        tooltip: "Show parts",
        tooltipToggled: "Hide parts",
        Dropdown: PartToolDropdownConnected,
        dropdowntooltip: (!isOpen ? "Show" : "Hide") + " Part Options",
        ...toolbarItemProps
      }}
    />
  );
});

const PartToolDropdownConnected = withEditorProps(PartToolDropdown);

function PartToolDropdown({
  sequenceData,
  updateSelectedPartTags,
  selectedPartTags
}) {
  // dispatch,
  // readOnly,
  // editorName,
  // selectionLayer,
  // toggleDropdown,
  // annotationLabelVisibility,
  if (!sequenceData) return <div>No Parts Present</div>;
  const tags = flatMap(sequenceData.parts, ({ tags }) => {
    return flatMap(tags, (t) => {
      if (t.tagOptions)
        return t.tagOptions.map((to) => {
          return { ...to, name: `${t.name}:${to.name}` };
        });
      return t;
    });
  }).map((t) => ({ ...t, label: t.name, value: t.name }));
  return (
    <>
      <TgSelect
        value={selectedPartTags.parts}
        onChange={updateSelectedPartTags}
        isTagSelect
        multi
        options={tags}
        autoFocus
      ></TgSelect>
    </>
  );
}
