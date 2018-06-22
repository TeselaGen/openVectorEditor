import React from "react";
import { Icon, Button, Intent } from "@blueprintjs/core";
import {
  FileUploadField,
  TextareaField,
  EditableTextField,
  CheckboxField
} from "teselagen-react-components";
import { reduxForm, FieldArray } from "redux-form";
import { anyToJson } from "bio-parsers";
import { flatMap } from "lodash";
import axios from "axios";
import uniqid from "uniqid";

// import { Checkbox } from "material-ui";
// import {  } from "teselagen-react-components/lib/FormComponents";

export default {
  updateKeys: ["alignmentTool", "toggleFindTool"],
  itemProps: ({ alignmentTool = {}, toggleDropdown }) => {
    return {
      Icon: <Icon icon={"align-left"} />,
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
      hasSavedAlignments,
      toggleDropdown,
      showCreateAlignmentDialog,
      sequenceData
    } = this.props;
    return (
      <div>
        <Button
          intent={Intent.PRIMARY}
          onClick={() => {
            toggleDropdown();
            showCreateAlignmentDialog({
              ...this.props,
              initialValues: {
                addedSequences: [{ ...sequenceData, isTemplate: true }]
              }
            });
          }}
        >
          Create New Alignment
        </Button>
        <div className="vespacer" />
        {hasSavedAlignments && (
          <div>
            <h6>Saved Alignments:</h6>
            {!savedAlignments.length && (
              <div style={{ fontStyle: "italic" }}> No Alignments</div>
            )}
            {savedAlignments.map((savedAlignment, i) => {
              return <div key={i}>Saved Alignment {i}</div>;
            })}
          </div>
        )}
      </div>
    );
  }
}

const instance = axios.create({
  // timeout: 1000,
  // headers: getJ5AuthorizationHeaders()
});

class AlignmentTool extends React.Component {
  state = {
    templateSeqIndex: 0
  };
  sendSelectedDataToBackendForAlignment = async ({
    addedSequences,
    isPairwiseAlignment,
    isAlignToRefSeq
  }) => {
    const {
      hideModal,
      /* onAlignmentSuccess, */ createNewAlignment,
      // createNewMismatchesList,
      upsertAlignmentRun
    } = this.props;
    const { templateSeqIndex } = this.state;
    const addedSequencesToUse = array_move(addedSequences, templateSeqIndex, 0);
    hideModal();
    const alignmentId = uniqid();
    // const alignmentIdMismatches = uniqid();
    createNewAlignment({
      id: alignmentId,
      name: addedSequencesToUse[0].name + " Alignment"
    });
    //set the alignment to loading
    upsertAlignmentRun({
      id: alignmentId,
      loading: true
    });
    // createNewMismatchesList({
    //   id: alignmentIdMismatches,
    //   name: addedSequencesToUse[0].name + " Mismatches"
    // });
    // upsertAlignmentRun({
    //   id: alignmentIdMismatches,
    //   loading: true
    // });

    // const j5server = process.env.REMOTE_J5 || "http://j5server.teselagen.com"
    // console.log('j5server:',j5server)
    // console.log('process.env:',process.env)

    window.toastr.success("Alignment submitted.");
    const {
      data: { alignedSequences: _alignedSequences, pairwiseAlignments, alignmentsToRefSeq } = {}
    } = await instance.post(
      "http://localhost:10000/alignment/run",
      // "http://j5server.teselagen.com:10000/alignment/run",
      // `${j5server}/alignment/run`,
      {
        sequencesToAlign: addedSequencesToUse.map(({ sequence, name, id }) => {
          return {
            //only send over the bear necessities :)
            sequence,
            name,
            id
          };
        }),
        isPairwiseAlignment,
        isAlignToRefSeq
        // options
      }
    );
    // alignmentsToRefSeq set to alignedSequences for now
    let alignedSequences = _alignedSequences;
    if (alignmentsToRefSeq) {
      alignedSequences = alignmentsToRefSeq;
    }
    console.log("aligned sequences", alignedSequences);
    if (!alignedSequences && !pairwiseAlignments)
      window.toastr.error("Error running sequence alignment!");
    //set the alignemnt to loading
    upsertAlignmentRun({
      id: alignmentId,
      pairwiseAlignments:
        pairwiseAlignments &&
        pairwiseAlignments.map((alignedSequences, topIndex) => {
          return alignedSequences.map((alignmentData, innerIndex) => {
            return {
              sequenceData:
                addedSequencesToUse[innerIndex > 0 ? topIndex + 1 : 0],
              alignmentData,
              chromatogramData: addedSequencesToUse[innerIndex].chromatogramData
            };
          });
        }),
        alignmentTracks:
        alignedSequences &&
        alignedSequences.map(alignmentData => {
          return {
            sequenceData: addedSequencesToUse[alignmentData.name.slice(0, alignmentData.name.indexOf("_"))],
            alignmentData,
            chromatogramData:
              addedSequencesToUse[alignmentData.name.slice(0, alignmentData.name.indexOf("_"))].chromatogramData
          };
        })
      // alignmentTracks:
      //   alignedSequences &&
      //   alignedSequences.map((alignmentData, i) => {
      //     return {
      //       sequenceData: addedSequencesToUse[i],
      //       alignmentData,
      //       chromatogramData: addedSequencesToUse[i].chromatogramData
      //     };
      //   })
    });
    // upsertAlignmentRun({
    //   id: alignmentIdMismatches,

    // });
  };

  handleFileUpload = (files, onChange) => {
    const { array } = this.props;
    flatMap(files, async file => {
      const results = await anyToJson(file.originalFileObj, {
        fileName: file.name,
        acceptParts: true
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
  renderAddSequence = ({ fields, templateSeqIndex }) => {
    const { handleSubmit } = this.props;

    const sequencesToAlign = fields.getAll() || [];
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
            {sequencesToAlign.map((addedSeq, index) => {
              return (
                <div
                  onClick={() => {
                    this.setState({
                      templateSeqIndex: index
                    });
                  }}
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
                  {index === templateSeqIndex && (
                    <div className={"pt-tag pt-round pt-intent-primary"}>
                      template
                    </div>
                  )}

                  <Button
                    onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      fields.remove(index);
                      if (index === templateSeqIndex) {
                        this.setState({ templateSeqIndex: 0 });
                      }
                    }}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
          </div>

          <CheckboxField
            name="isPairwiseAlignment"
            label={
              <div>
                Create Pairwise Alignment{" "}
                <span style={{ fontSize: 10 }}>
                  Individually align each uploaded file against the template
                  sequence (instead of creating a single Multiple Sequence
                  Alignment)
                </span>
              </div>
            }
          />
          <CheckboxField
            name="isAlignToRefSeq"
            label={
              <div>
                Align Sequencing Reads to Reference Sequence{" "}
                <span style={{ fontSize: 10 }}>
                  Align short sequencing reads to a long reference sequence
                </span>
              </div>
            }
          />

          <Button
            style={{ marginTop: 15, float: "right" }}
            intent={Intent.PRIMARY}
            disabled={sequencesToAlign.length < 2}
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
    const { templateSeqIndex } = this.state;
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
          templateSeqIndex={templateSeqIndex}
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

function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
}
