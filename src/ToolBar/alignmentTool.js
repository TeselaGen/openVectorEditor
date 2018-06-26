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
import { cloneDeep } from "lodash";

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
      Dropdown: AlignmentToolDropdown,
      onIconClick: toggleDropdown,
      noDropdownIcon: true,
      tooltip: alignmentTool.isOpen
        ? "Hide Alignment Tool"
        : "Show Alignment Tool"
    };
  }
};

class AlignmentToolDropdown extends React.Component {
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
    isAlignToRefSeq,
    isAutotrimmedSeq
  }) => {
    const {
      hideModal,
      /* onAlignmentSuccess, */ createNewAlignment,
      // createNewMismatchesList,
      upsertAlignmentRun
    } = this.props;
    const { templateSeqIndex } = this.state;
    const addedSequencesToUse = array_move(addedSequences, templateSeqIndex, 0);
    console.log('addedSequencesToUse:',addedSequencesToUse)
    
    let addedSequencesToUseTrimmed;
    if (isAutotrimmedSeq) {
      addedSequencesToUseTrimmed = cloneDeep(addedSequencesToUse);
      // trimming any sequences with chromatogram data
      for (let i = 0; i < addedSequencesToUseTrimmed.length; i++) {
        if (addedSequencesToUseTrimmed[i].chromatogramData.qualNums) {
          // returning bp pos for { suggestedTrimStart, suggestedTrimEnd }
          const { suggestedTrimStart, suggestedTrimEnd } = mottTrim(addedSequencesToUseTrimmed[i].chromatogramData.qualNums)
          console.log('i, suggestedTrimStart, suggestedTrimEnd:',i, suggestedTrimStart, suggestedTrimEnd)
          addedSequencesToUseTrimmed[i].sequence = addedSequencesToUseTrimmed[i].sequence.slice(suggestedTrimStart, suggestedTrimEnd + 1)
          const elementsToTrim = ["baseCalls", "basePos", "qualNums"]
          for (let element in addedSequencesToUseTrimmed[i].chromatogramData) {
            if (elementsToTrim.indexOf(element) !== -1) {
              // console.log('addedSequencesToUseTrimmed[i].chromatogramData[element].slice(suggestedTrimStart, suggestedTrimEnd + 1):',addedSequencesToUseTrimmed[i].chromatogramData[element].slice(suggestedTrimStart, suggestedTrimEnd + 1))
              addedSequencesToUseTrimmed[i].chromatogramData[element] = addedSequencesToUseTrimmed[i].chromatogramData[element].slice(suggestedTrimStart, suggestedTrimEnd + 1)
            }
          }
        }
      }
    }
    console.log('addedSequencesToUseTrimmed:',addedSequencesToUseTrimmed)
    let seqsToAlign;
    if (addedSequencesToUseTrimmed) {
      seqsToAlign = addedSequencesToUseTrimmed
      console.log('seqsToAlign:',seqsToAlign)
    } else {
      seqsToAlign = addedSequencesToUse
      console.log('seqsToAlign:',seqsToAlign)
    }

    hideModal();
    const alignmentId = uniqid();
    // const alignmentIdMismatches = uniqid();
    createNewAlignment({
      id: alignmentId,
      name: seqsToAlign[0].name + " Alignment"
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
    const replaceProtocol = url => {
      return url.replace('http://', window.location.protocol + "//")
    }

    const seqInfoToSend = seqsToAlign.map(({ sequence, name, id }) => {
      return {
        sequence,
        name,
        id
      };
    })

    const {
      data: { alignedSequences, pairwiseAlignments } = {}
    } = await instance.post(
        replaceProtocol("http://j5server.teselagen.com/alignment/run"),
      {
        //only send over the bear necessities :)
        sequencesToAlign: seqInfoToSend,
        isPairwiseAlignment,
        isAlignToRefSeq
      }
    );
    console.log("aligned sequences", alignedSequences);
    if (!alignedSequences && !pairwiseAlignments)
      window.toastr.error("Error running sequence alignment!");
    //set the alignment to loading
    upsertAlignmentRun({
      id: alignmentId,
      pairwiseAlignments:
        pairwiseAlignments &&
        pairwiseAlignments.map((alignedSequences, topIndex) => {
          return alignedSequences.map((alignmentData, innerIndex) => {
            return {
              sequenceData: seqsToAlign[innerIndex > 0 ? topIndex + 1 : 0],
              alignmentData,
              chromatogramData: seqsToAlign[innerIndex].chromatogramData
            };
          });
        }),
        alignmentTracks:
        alignedSequences &&
        alignedSequences.map(alignmentData => {
          return {
            sequenceData: seqsToAlign[alignmentData.name.slice(0, alignmentData.name.indexOf("_"))],
            alignmentData,
            chromatogramData: seqsToAlign[alignmentData.name.slice(0, alignmentData.name.indexOf("_"))].chromatogramData
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
          <CheckboxField
            name="isAutotrimmedSeq"
            label={
              <div>
                Auto-trim Sequences{" "}
                <span style={{ fontSize: 10 }}>
                  Automatically trim low-quality ends of sequences based on quality scores
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

function mottTrim(qualNums) {
  let startPos = 0;
  let endPos = 0;
  let tempStart = 0;
  // let tempEnd;
  let score = 0;
  const cutoff = 0.05;
  for (let count = 0; count < qualNums.length; count++) {
    score = score + cutoff - Math.pow(10, qualNums[count] / -10);
    if (score < 0) {
      tempStart = count;
    }
    if (count - tempStart > endPos - startPos) {
      startPos = tempStart;
      endPos = count;
    }
  }
  return {
    suggestedTrimStart: startPos,
    suggestedTrimEnd: endPos
  };
}