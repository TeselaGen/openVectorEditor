import { Icon } from "@blueprintjs/core";
// import { Checkbox, Button } from "@blueprintjs/core";
import React from "react";
// import { connect } from "react-redux";
// import { convertRangeTo1Based } from "ve-range-utils";
import { featureIcon } from "teselagen-react-components";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";

export default connectToEditor(
  ({ annotationVisibility = {}, toolBar = {} }) => {
    return {
      toggled: annotationVisibility.features,
      isOpen: toolBar.openItem === "featureTool"
    };
  }
)(({ toolbarItemProps, toggled, annotationVisibilityToggle, isOpen }) => {
  return (
    <ToolbarItem
      {...{
        Icon: <Icon icon={featureIcon} />,
        onIconClick: function() {
          annotationVisibilityToggle("features");
        },
        toggled,
        tooltip: "Show features",
        tooltipToggled: "Hide features",
        // Dropdown: ConnectedFeatureToolDropdown,
        dropdowntooltip: (!isOpen ? "Show" : "Hide") + " Feature Options",
        ...toolbarItemProps
      }}
    />
  );
});

// function FeatureToolDropDown({
//   dispatch,
//   readOnly,
//   editorName,
//   selectionLayer,
//   toggleDropdown,
//   annotationLabelVisibility,
//   annotationLabelVisibilityToggle
// }) {
//   return (
//     <div style={{ paddingTop: 5 }}>
//       <Checkbox
//         onChange={function() {
//           annotationLabelVisibilityToggle("features");
//           /* labelVisibilityToggle("features"); */
//         }}
//         checked={annotationLabelVisibility.features}
//         label={"Show feature labels"}
//       />
//       {!readOnly && (
//         <Button
//           onClick={() => {
//             toggleDropdown();
//             let initialValues = {};
//             if (selectionLayer && selectionLayer.start) {
//               initialValues = convertRangeTo1Based(selectionLayer);
//             }

//             dispatch({
//               type: "TG_SHOW_MODAL",
//               name: "AddOrEditFeatureDialog", //you'll need to pass a unique dialogName prop to the compoennt
//               props: {
//                 editorName,
//                 dialogProps: {
//                   title: "New Feature"
//                 },
//                 initialValues
//               }
//             });
//           }}
//         >
//           Add New Feature
//         </Button>
//       )}
//     </div>
//   );
// }
