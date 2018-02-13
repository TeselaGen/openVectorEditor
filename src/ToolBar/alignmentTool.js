import React from "react";
import { Icon, IconClasses, Button, Intent } from "@blueprintjs/core";
import {
  FileUploadField,
  TextareaField,
  EditableTextField
} from "teselagen-react-components";
import { reduxForm } from "redux-form";

export default {
  updateKeys: ["alignmentTool", "toggleFindTool"],
  itemProps: ({ alignmentTool = {}, toggleDropdown }) => {
    return {
      Icon: <Icon iconName={IconClasses.ALIGN_LEFT} />,
      // toggled: alignmentTool.isOpen,
      renderIconAbove: alignmentTool.isOpen,
      // onIconClick: toggleFindTool,
      Dropdown: AlignmentToolInner,
      onIconClick: toggleDropdown,
      noDropdownIcon: true,
      tooltip: alignmentTool.isOpen
        ? "Hide Alignment Tool"
        : "Show Alignment Tool"
    };
  }
};

class AlignmentTool extends React.Component {
  sendSelectedDataToBackendForAlignment = () => {
    console.log("sending data to backend!");
  };

  render() {
    const { hey } = this.props;
    return (
      <div className="veAlignmentTool">
        <h6>Upload files you'd like to align (.ab1, .fasta, .gb) </h6>
        <FileUploadField name="sequenceUpload" />
        <h6>Or Select from your sequence library </h6>
        <h6>Or enter sequences in plain text format</h6>
        <div className="veAlignmentToolAddYourOwn">
          <EditableTextField
            placeholder="Untitled Sequence"
            name="addYourOwnTextName"
          />
          <TextareaField placeholder="AGTTGAGC" name="addYourOwnTextBps" />
          <Button> Add </Button>
        </div>

        <div className="veAlignmentToolSelectedSequenceList">
          List of sequences goes here
        </div>

        <Button
          intent={Intent.PRIMARY}
          onClick={this.sendSelectedDataToBackendForAlignment}
        >
          Create alignment
        </Button>
      </div>
    );
  }
}

export const AlignmentToolInner = reduxForm({ form: "veAlignmentTool" })(
  AlignmentTool
);
