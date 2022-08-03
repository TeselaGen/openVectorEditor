import { Icon } from "@blueprintjs/core";
import React from "react";
import {
  orfIcon,
  CmdCheckbox,
  CmdDiv,
  InfoHelper
} from "teselagen-react-components";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";
import withEditorProps from "../withEditorProps";
import getCommands from "../commands";

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
        Icon: <Icon data-test="orfTool" icon={orfIcon} />,
        onIconClick: function () {
          annotationVisibilityToggle("orfs");
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

const OrfToolDropdown = withEditorProps(
  class OrfDropdown extends React.Component {
    constructor(props) {
      super(props);
      this.commands = getCommands(this);
    }
    render() {
      return (
        <div className="veToolbarOrfOptionsHolder">
          <CmdCheckbox
            prefix="Show "
            cmd={this.commands.toggleOrfTranslations}
          />
          <CmdCheckbox
            prefix="Show "
            cmd={this.commands.useGtgAndCtgAsStartCodons}
          />
          <CmdDiv cmd={this.commands.minOrfSizeCmd} />
          <div className="vespacer" />

          <InfoHelper
            displayToSide
            content="To translate an arbitrary area, right click a selection."
          />
        </div>
      );
    }
  }
);
// const OrfToolDropdown = withEditorProps(function({
//   useAdditionalOrfStartCodons,
//   useAdditionalOrfStartCodonsToggle,
//   annotationVisibility,
//   annotationVisibilityToggle,
//   editorName
// }) {
//   return (
//     <div className="veToolbarOrfOptionsHolder">
//       {/* <div className="vespacer" />
//       <MinOrfSize editorName={editorName} />
//       <Checkbox
//         onChange={function() {
//           annotationVisibilityToggle("orfTranslations");
//         }}
//         disabled={!annotationVisibility.orfs}
//         checked={annotationVisibility.orfTranslations}
//         label="Show translations for ORFs"
//       />
//       <Checkbox
//         onChange={function() {
//           annotationVisibilityToggle("cdsFeatureTranslations");
//         }}
//         checked={annotationVisibility.cdsFeatureTranslations}
//         label="Show translations for CDS features"
//       />
//       <Checkbox
//         onChange={useAdditionalOrfStartCodonsToggle}
//         checked={useAdditionalOrfStartCodons}
//         label="Use GTG and CTG as start codons"
//       /> */}
//       <div className="vespacer" />

//       <InfoHelper
//         displayToSide
//         content="To translate an arbitrary area, right click a selection."
//       />
//     </div>
//   );
// });

// export const MinOrfSize = connectToEditor(editorState => {
//   return {
//     sequenceLength: selectors.sequenceLengthSelector(editorState),
//     minimumOrfSize: editorState.minimumOrfSize
//   };
// })(
//   ({
//     minimumOrfSizeUpdate,
//     sequenceLength,
//     annotationVisibilityShow,
//     minimumOrfSize
//   }) => {
//     return (
//       <div data-test="min-orf-size" style={{ display: "flex" }}>
//         Minimum ORF Size:
//         <input
//           type="number"
//           className={classNames(Classes.INPUT, "minOrfSizeInput")}
//           onChange={function(event) {
//             let minimumOrfSize = parseInt(event.target.value, 10);
//             if (!(minimumOrfSize > -1)) return;
//             if (minimumOrfSize > sequenceLength) return;
//             annotationVisibilityShow("orfs");
//             minimumOrfSizeUpdate(minimumOrfSize);
//           }}
//           value={minimumOrfSize}
//         />
//       </div>
//     );
//   }
// );
