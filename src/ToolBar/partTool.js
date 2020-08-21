import { Icon } from "@blueprintjs/core";
// import { Checkbox, Button } from "@blueprintjs/core";
import {
  TgSelect,
  getKeyedTagsAndTagOptions
} from "teselagen-react-components";
import React from "react";
// import { connect } from "react-redux";
// import { convertRangeTo1Based } from "ve-range-utils";
//import { partIcon } from "teselagen-react-components";
import ToolbarItem from "./ToolbarItem";
import withEditorProps, { connectToEditor } from "../withEditorProps";
import { flatMap } from "lodash";
import { uniqBy } from "lodash";

export default connectToEditor(
  ({ annotationVisibility = {}, toolBar = {} }) => {
    return {
      toggled: annotationVisibility.parts,
      isOpen: toolBar.openItem === "partTool"
    };
  }
)(
  ({
    allPartTags,
    editTagsLink,
    toolbarItemProps,
    toggled,
    annotationVisibilityToggle,
    isOpen
  }) => {
    return (
      <ToolbarItem
        {...{
          Icon: <Icon icon="doughnut-chart" />,
          onIconClick: function () {
            annotationVisibilityToggle("parts");
          },
          toggled,
          editTagsLink,
          keyedTags: getKeyedTagsAndTagOptions(allPartTags),
          tooltip: "Show parts",
          tooltipToggled: "Hide parts",
          noDropdownIcon: !allPartTags,
          Dropdown: PartToolDropdownConnected,
          dropdowntooltip: (!isOpen ? "Show" : "Hide") + " Part Options",
          ...toolbarItemProps
        }}
      />
    );
  }
);

const PartToolDropdownConnected = withEditorProps(PartToolDropdown);

function PartToolDropdown({
  sequenceData,
  updateSelectedPartTags,
  selectedPartTags,
  keyedTags,
  editTagsLink
}) {
  // dispatch,
  // readOnly,
  // editorName,
  // selectionLayer,
  // toggleDropdown,
  // annotationLabelVisibility,
  if (!sequenceData) return <div>No Parts Present</div>;
  const tags = uniqBy(
    flatMap(sequenceData.parts, ({ tags }) => {
      return flatMap(tags, (t) => {
        const tag = keyedTags[t];
        if (!tag) return [];
        return tag;
      });
    }),
    "value"
  );
  return (
    <div>
      <h6>Search Parts By Tag: </h6>
      <div style={{ display: "flex" }}>
        <TgSelect
          value={selectedPartTags.parts}
          onChange={updateSelectedPartTags}
          isTagSelect
          multi
          options={tags}
          autoFocus
        ></TgSelect>
        {editTagsLink || null}
      </div>
    </div>
  );
}
