import React from "react";
import { Icon, Button, Intent, Classes } from "@blueprintjs/core";
import {
  FileUploadField,
  TextareaField,
  EditableTextField,
  CheckboxField,
  wrapDialog
} from "teselagen-react-components";
import { reduxForm, FieldArray } from "redux-form";
import { anyToJson } from "bio-parsers";
import { flatMap } from "lodash";
import uniqid from "shortid";
import { cloneDeep } from "lodash";
import classNames from "classnames";

import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";
import withEditorProps from "../withEditorProps";
import { showDialog } from "../GlobalDialogUtils";
import { compose } from "recompose";
import { array_move } from "./array_move";

export default connectToEditor(({ readOnly, toolBar = {} }) => {
  return {
    readOnly: readOnly,
    isOpen: toolBar.openItem === "alignmentTool"
  };
})(({ toolbarItemProps, isOpen }) => {
  return (
    <ToolbarItem
      {...{
        Icon: <Icon data-test="alignmentTool" icon="align-left" />,
        // toggled: alignmentTool.isOpen,
        renderIconAbove: isOpen,
        // onIconClick: toggleFindTool,
        Dropdown: ConnectedAlignmentToolDropdown,
        onIconClick: "toggleDropdown",
        noDropdownIcon: true,
        tooltip: isOpen ? "Hide Alignment Tool" : "Align to This Sequence",
        ...toolbarItemProps
      }}
    />
  );
});

class AlignmentToolDropdown extends React.Component {
  render() {
    const {
      savedAlignments = [],
      hasSavedAlignments,
      toggleDropdown,
      sequenceData
    } = this.props;
    return (
      <div>
        <Button
          intent={Intent.PRIMARY}
          onClick={() => {
            toggleDropdown();
            showDialog({
              dialogType: "AlignmentToolDialog",
              props: {
                createNewAlignment: this.props.createNewAlignment,
                upsertAlignmentRun: this.props.upsertAlignmentRun,
                initialValues: {
                  addedSequences: [{ ...sequenceData, isTemplate: true }]
                }
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
const ConnectedAlignmentToolDropdown = withEditorProps(AlignmentToolDropdown);

class AlignmentTool extends React.Component {
  state = {
    templateSeqIndex: 0
  };
  sendSelectedDataToBackendForAlignment = async (values) => {
    const {
      addedSequences,
      isPairwiseAlignment,
      isAlignToRefSeq,
      isAutotrimmedSeq
    } = values;
    const {
      hideModal,
      /* onAlignmentSuccess, */ createNewAlignment,
      // createNewMismatchesList,
      upsertAlignmentRun
    } = this.props;
    const { templateSeqIndex } = this.state;
    const addedSequencesToUse = array_move(addedSequences, templateSeqIndex, 0);

    let addedSequencesToUseTrimmed;
    if (isAutotrimmedSeq) {
      addedSequencesToUseTrimmed = cloneDeep(addedSequencesToUse);
      // trimming any sequences with chromatogram data
      for (let i = 0; i < addedSequencesToUseTrimmed.length; i++) {
        if ("chromatogramData" in addedSequencesToUseTrimmed[i]) {
          // if (addedSequencesToUseTrimmed[i].chromatogramData.qualNums) {
          if ("qualNums" in addedSequencesToUseTrimmed[i].chromatogramData) {
            // returning bp pos for { suggestedTrimStart, suggestedTrimEnd }
            const { suggestedTrimStart, suggestedTrimEnd } = mottTrim(
              addedSequencesToUseTrimmed[i].chromatogramData.qualNums
            );
            addedSequencesToUseTrimmed[i].sequence = addedSequencesToUseTrimmed[
              i
            ].sequence.slice(suggestedTrimStart, suggestedTrimEnd + 1);
            const elementsToTrim = ["baseCalls", "basePos", "qualNums"];
            // eslint-disable-next-line no-unused-vars
            for (const element in addedSequencesToUseTrimmed[i]
              .chromatogramData) {
              if (elementsToTrim.indexOf(element) !== -1) {
                addedSequencesToUseTrimmed[i].chromatogramData[element] =
                  addedSequencesToUseTrimmed[i].chromatogramData[element].slice(
                    suggestedTrimStart,
                    suggestedTrimEnd + 1
                  );
              }
            }
          }
        }
      }
    }
    let seqsToAlign;
    if (addedSequencesToUseTrimmed) {
      seqsToAlign = addedSequencesToUseTrimmed;
    } else {
      seqsToAlign = addedSequencesToUse;
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
    //   name: addedSequencesToUse[0].name + " Mismatches",
    //   alignmentId: alignmentId
    // });

    // const j5server = process.env.REMOTE_J5 || "http://j5server.teselagen.com"

    window.toastr.success("Alignment submitted.");
    const replaceProtocol = (url) => {
      return url.replace("http://", window.location.protocol + "//");
    };

    const seqInfoToSend = seqsToAlign.map(({ sequence, name, id }) => {
      return {
        sequence,
        name,
        id
      };
    });

    const {
      alignedSequences: _alignedSequences,
      pairwiseAlignments,
      alignmentsToRefSeq
    } = await (
      await fetch({
        url: replaceProtocol("http://j5server.teselagen.com/alignment/run"),
        method: "post",
        body: JSON.stringify({
          //only send over the bear necessities :)
          sequencesToAlign: seqInfoToSend,
          isPairwiseAlignment,
          isAlignToRefSeq
        })
      })
    ).json();

    // alignmentsToRefSeq set to alignedSequences for now
    let alignedSequences = _alignedSequences;
    if (alignmentsToRefSeq) {
      alignedSequences = alignmentsToRefSeq;
    }
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
        alignedSequences.map((alignmentData) => {
          return {
            sequenceData:
              seqsToAlign[
                alignmentData.name.slice(0, alignmentData.name.indexOf("_"))
              ],
            alignmentData,
            chromatogramData:
              seqsToAlign[
                alignmentData.name.slice(0, alignmentData.name.indexOf("_"))
              ].chromatogramData
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
  };

  handleFileUpload = (files, onChange) => {
    const { array } = this.props;
    flatMap(files, async (file) => {
      const results = await anyToJson(file.originalFileObj, {
        fileName: file.name,
        acceptParts: true
      });
      return results.forEach((result) => {
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
            addSeq={(newSeq) => {
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
                    <div
                      className={classNames(
                        Classes.TAG,
                        Classes.ROUND,
                        Classes.INTENT_PRIMARY
                      )}
                    >
                      template
                    </div>
                  )}

                  <Button
                    onClick={(e) => {
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
          <br />
          <CheckboxField
            name="isPairwiseAlignment"
            style={{ display: "flex", alignItems: "center" }}
            label={
              <div>
                Create Pairwise Alignment{" "}
                <span style={{ fontSize: 11 }}>
                  Individually align each uploaded file against the template
                  sequence (instead of creating a single Multiple Sequence
                  Alignment)
                </span>
              </div>
            }
          />
          <CheckboxField
            name="isAlignToRefSeq"
            style={{ display: "flex", alignItems: "center" }}
            label={
              <div>
                Align Sequencing Reads to Reference Sequence{" "}
                <span style={{ fontSize: 11 }}>
                  Align short sequencing reads to a long reference sequence
                </span>
              </div>
            }
          />
          <CheckboxField
            name="isAutotrimmedSeq"
            style={{ display: "flex", alignItems: "center" }}
            label={
              <div>
                Auto-Trim Sequences{" "}
                <span style={{ fontSize: 11 }}>
                  Automatically trim low-quality ends of sequences based on
                  quality scores
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
          name="addedSequences"
          templateSeqIndex={templateSeqIndex}
          component={this.renderAddSequence}
        />
      </div>
    );
  }
}

export const AlignmentToolDialog = compose(
  wrapDialog({ title: "Create New Alignment" }),
  reduxForm({
    form: "veAlignmentTool"
  })
)(AlignmentTool);

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
    <form
      onSubmit={handleSubmit((vals) => {
        reset();
        addSeq(vals);
      })}
    >
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
      <Button disabled={pristine || error} type="submit">
        Add
      </Button>
    </form>
  );
});

function mottTrim(qualNums) {
  if (!qualNums) return;
  let startPos = 0;
  let endPos = 0;
  const totalScoreInfo = [];
  let score = 0;
  let totalScore = 0;
  const cutoff = 0.05;
  for (let i = 0; i < qualNums.length; i++) {
    // low-quality bases have high error probabilities, so may have a negative base score
    score = cutoff - Math.pow(10, qualNums[i] / -10);
    totalScore += score;
    totalScoreInfo.push(totalScore);
    // score = score + cutoff - Math.pow(10, qualNums[i] / -10);
    // if (totalScore < 0) {
    //   tempStart = i;
    // }
    // if (i - tempStart > endPos - startPos) {
    //   startPos = tempStart;
    //   endPos = i;
    // }
    if (totalScore < 0) {
      totalScore = 0;
    }
  }
  const firstPositiveValue = totalScoreInfo.find((e) => {
    return e > 0;
  });
  startPos = totalScoreInfo.indexOf(firstPositiveValue);
  const highestValue = Math.max(...totalScoreInfo);
  endPos = totalScoreInfo.lastIndexOf(highestValue);
  return {
    suggestedTrimStart: startPos,
    suggestedTrimEnd: endPos
  };
}
