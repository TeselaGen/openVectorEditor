import { Checkbox, Button } from "@blueprintjs/core";
import React from "react";
import { connect } from "react-redux";
import { convertRangeTo1Based } from "ve-range-utils";
import show_features from "./veToolbarIcons/show_features.png";

export default ({ annotationVisibility = {}, isOpen }) => {
  return {
    Icon: FeatureTool,
    toggled: annotationVisibility.features,
    tooltip: "Show features",
    tooltipToggled: "Hide features",
    Dropdown: ConnectedFeatureToolDropdown,
    dropdowntooltip: (!isOpen ? "Show" : "Hide") + " Feature Options",
    id: "features"
  };
};

function FeatureTool({ annotationVisibilityToggle }) {
  return (
    <div
      onClick={function() {
        annotationVisibilityToggle("features");
      }}
    >
      <img src={show_features} alt="Show features" />
    </div>
  );
}

function FeatureToolDropDown({
  dispatch,
  readOnly,
  editorName,
  selectionLayer,
  annotationLabelVisibility,
  annotationLabelVisibilityToggle
}) {
  return (
    <div style={{ paddingTop: 5 }}>
      <Checkbox
        onChange={function() {
          annotationLabelVisibilityToggle("features");
          /* labelVisibilityToggle("features"); */
        }}
        checked={annotationLabelVisibility.features}
        label={"Show feature labels"}
      />
      {!readOnly && (
        <Button
          onClick={() => {
            let initialValues = {};
            if (selectionLayer && selectionLayer.start) {
              initialValues = convertRangeTo1Based(selectionLayer);
            }

            dispatch({
              type: "TG_SHOW_MODAL",
              name: "AddOrEditFeatureDialog", //you'll need to pass a unique dialogName prop to the compoennt
              props: {
                editorName,
                dialogProps: {
                  title: "Add Feature"
                },
                initialValues
              }
            });
          }}
        >
          Add New Feature
        </Button>
      )}
    </div>
  );
}
const ConnectedFeatureToolDropdown = connect()(FeatureToolDropDown);
