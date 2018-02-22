import React from "react";
import { Icon, IconClasses, Button, Intent } from "@blueprintjs/core";
import {
  FileUploadField,
  TextareaField,
  EditableTextField
  // magicDownload
} from "teselagen-react-components";
import { reduxForm, FieldArray } from "redux-form";
import { anyToJson } from "bio-parsers";
import { flatMap } from "lodash";
import axios from "axios";

export default {
  updateKeys: ["alignmentTool", "toggleFindTool"],
  itemProps: ({ alignmentTool = {}, toggleDropdown }) => {
    return {
      Icon: <Icon iconName={IconClasses.ALIGN_LEFT} />,
      // toggled: alignmentTool.isOpen,
      renderIconAbove: alignmentTool.isOpen,
      // onIconClick: toggleFindTool,
      Dropdown: AlignmentToolDropown,
      onIconClick: toggleDropdown,
      noDropdownIcon: true,
      tooltip: alignmentTool.isOpen
        ? "Hide Alignment Tool"
        : "Show Alignment Tool"
    };
  }
};

class AlignmentToolDropown extends React.Component {
  render() {
    const {
      savedAlignments = [],
      showCreateAlignmentDialog,
      sequenceData
    } = this.props;
    return (
      <div>
        <Button
          intent={Intent.PRIMARY}
          onClick={() => {
            showCreateAlignmentDialog({
              initialValues: {
                addedSequences: [sequenceData]
              }
            });
          }}
        >
          Create New Alignment
        </Button>
        <div className="vespacer" />
        <h6>Saved Alignments:</h6>
        {!savedAlignments.length && (
          <div style={{ fontStyle: "italic" }}> No Alignments</div>
        )}
        {savedAlignments.map((savedAlignment, i) => {
          return <div key={i}>Saved Alignment {i}</div>;
        })}
      </div>
    );
  }
}

const instance = axios.create({
  // timeout: 1000,
  // headers: getJ5AuthorizationHeaders()
});

class AlignmentTool extends React.Component {
  sendSelectedDataToBackendForAlignment = ({ addedSequences }) => {
    return instance.post("http://j5server.teselagen.com/alignment/run", {
      sequencesToAlign: addedSequences
    });
    // console.log("sending data to backend!");
  };

  handleFileUpload = (files, onChange) => {
    const { array } = this.props;
    flatMap(files, async file => {
      const results = await anyToJson(file.originalFileObj, {
        fileName: file.name
      });
      return results.forEach(result => {
        if (result.success) {
          array.push("addedSequences", result.parsedSequence);
        } else {
          return window.toastr.warning("Error parsing file: ", file.name);
        }
      });
    });
    onChange([]);
  };
  renderAddSequence = ({ fields }) => {
    const { handleSubmit } = this.props;
    const allFields = fields.getAll() || [];
    return (
      <div>
        <h6>Or enter sequences in plain text format</h6>
        <div>
          <AddYourOwnSeqForm
            addSeq={newSeq => {
              fields.push(newSeq);
            }}
          />
          <h6 style={{ marginTop: 15 }}>Sequences To Align: </h6>
          {!fields.getAll() && <div>No sequences added yet.</div>}
          <div
            style={{ maxHeight: 180, overflowY: "auto" }}
            className="veAlignmentToolSelectedSequenceList"
          >
            {allFields.map((addedSeq, index) => {
              return (
                <div
                  style={{
                    borderBottom: "1px solid lightgrey",
                    paddingBottom: 4,
                    marginBottom: 4,
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex"
                  }}
                  key={index}
                >
                  <div>
                    {addedSeq.name}{" "}
                    <span style={{ fontSize: 10 }}>
                      {" "}
                      ({addedSeq.sequence.length} bps)
                    </span>
                  </div>

                  <Button
                    onClick={() => {
                      fields.remove(index);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
          </div>

          <Button
            style={{ marginTop: 15, float: "right" }}
            intent={Intent.PRIMARY}
            disabled={allFields.length <= 2}
            onClick={handleSubmit(this.sendSelectedDataToBackendForAlignment)}
          >
            Create alignment
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const { selectFromSequenceLibraryHook } = this.props;
    return (
      <div style={{ padding: 20 }} className="veAlignmentTool">
        <h6>Upload files you'd like to align (.ab1, .fasta, .gb) </h6>
        <FileUploadField
          name="alignmentToolSequenceUpload"
          style={{ maxWidth: 400 }}
          beforeUpload={this.handleFileUpload}
        />
        {selectFromSequenceLibraryHook && (
          <h6>Or Select from your sequence library </h6>
        )}

        <FieldArray
          name={`addedSequences`}
          component={this.renderAddSequence}
        />
      </div>
    );
  }
}

export const AlignmentToolInner = reduxForm({
  form: "veAlignmentTool"
  // initialValues: {
  //   addedSequences: []
  // },
})(AlignmentTool);

const AddYourOwnSeqForm = reduxForm({
  form: "AddYourOwnSeqForm",
  validate: ({ name, sequence }) => {
    const errors = {};
    if (!name) {
      errors.name = "Required";
    }
    if (!sequence) {
      errors.sequence = "Required";
    }
    return errors;
  }
})(({ pristine, error, handleSubmit, reset, addSeq }) => {
  return (
    <div>
      <EditableTextField
        style={{ maxWidth: 200 }}
        placeholder="Untitled Sequence"
        name="name"
      />
      <TextareaField
        style={{ maxWidth: 400 }}
        placeholder="AGTTGAGC"
        name="sequence"
      />
      <Button
        disabled={pristine || error}
        onClick={handleSubmit(vals => {
          reset();
          addSeq(vals);
        })}
      >
        Add
      </Button>
    </div>
  );
});
