import React, { useState } from "react";

import { reduxForm, FieldArray, formValues } from "redux-form";

import {
  InputField,
  RadioGroupField,
  NumericInputField,
  withDialog
} from "teselagen-react-components";
import { compose } from "redux";
import { Button, Intent, Classes, EditableText, Icon } from "@blueprintjs/core";
import {
  convertRangeTo0Based,
  isRangeWithinRange,
  checkIfPotentiallyCircularRangesOverlap,
  getRangeLength
} from "ve-range-utils";
import { tidyUpAnnotation, featureColors } from "ve-sequence-utils";
import classNames from "classnames";
import { store, view } from "@risingstack/react-easy-state";

import withEditorProps from "../../withEditorProps";
import { withProps } from "recompose";
import { map, flatMap } from "lodash";
import "./style.css";

class AddOrEditAnnotationDialog extends React.Component {
  componentDidMount() {
    const initialNotes =
      (this.props.initialValues && this.props.initialValues.notes) || {};
    this.notes = store(
      flatMap(initialNotes, (noteValues, noteType) => {
        return map(noteValues, (value) => ({
          key: noteType,
          value: value
        }));
      })
    );
  }
  formatStart = (val) => {
    const { isProtein } = this.props.sequenceData || {};
    if (isProtein) {
      return (val + 2) / 3;
    }
    return val;
  };
  formatEnd = (val) => {
    const { isProtein } = this.props.sequenceData || {};
    if (isProtein) {
      return val / 3;
    }
    return val;
  };
  parseStart = (val) => {
    const { isProtein } = this.props.sequenceData || {};
    if (isProtein) {
      return val * 3 - 2;
    }
    return val;
  };
  parseEnd = (val) => {
    const { isProtein } = this.props.sequenceData || {};
    if (isProtein) {
      return val * 3;
    }
    return val;
  };
  renderLocations = (props) => {
    const { fields } = props;
    const { sequenceData = { sequence: "" }, start, end } = this.props;
    const sequenceLength = sequenceData.sequence.length;

    const locations = fields.getAll() || [];
    return (
      <div>
        {locations.length > 1 && (
          <div>
            <div
              style={{
                marginBottom: 10,
                marginTop: 3
              }}
            >
              Joined Feature Spans:
            </div>
            <div style={{ marginLeft: 50 }}>
              {!locations.length && (
                <div style={{ marginBottom: 10 }}>
                  No sub-locations. Click "Add Location" to add sub-locations
                  for this feature.{" "}
                </div>
              )}
              {fields.map((member, index) => {
                //the locations will have already been converted to 1 based ranges
                return (
                  <div style={{}} key={index}>
                    <div style={{ display: "flex", marginBottom: 10 }}>
                      <NumericInputField
                        disabled={this.props.readOnly}
                        containerStyle={{ marginBottom: 0, marginRight: 10 }}
                        inlineLabel
                        tooltipError
                        min={1}
                        format={this.formatStart}
                        parse={this.parseStart}
                        max={sequenceLength || 1}
                        name={`${member}.start`}
                        label="Start:"
                      />
                      <NumericInputField
                        disabled={this.props.readOnly}
                        containerStyle={{ marginBottom: 0, marginRight: 10 }}
                        inlineLabel
                        tooltipError
                        min={1}
                        format={this.formatEnd}
                        parse={this.parseEnd}
                        max={sequenceLength || 1}
                        name={`${member}.end`}
                        label="End:"
                      />
                      <Button
                        disabled={this.props.readOnly}
                        onClick={() => {
                          if (locations.length === 2) {
                            fields.remove(0);
                            fields.remove(1);
                          } else {
                            fields.remove(index);
                          }
                        }}
                        minimal
                        icon="trash"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <Button
          disabled={this.props.readOnly}
          style={{ marginBottom: 10, left: "50%" }}
          // intent="primary"
          onClick={() => {
            if (locations && locations.length) {
              fields.push({
                start: locations[locations.length - 1].end + 1,
                end:
                  locations[locations.length - 1].end +
                  (sequenceData.isProtein ? 3 : 2)
              });
            } else {
              const end1 = Math.max(start, end - 10);
              fields.push({
                start,
                end: end1
              });
              fields.push({
                start: end1 + 3,
                end: end1 + 10
              });
            }
          }}
          icon="add"
        >
          Add Joined Feature Span
        </Button>
      </div>
    );
  };
  render() {
    const {
      hideModal,
      sequenceData = { sequence: "" },
      handleSubmit,
      beforeAnnotationCreate,
      renderTypes,
      renderTags,
      annotationTypePlural,
      annotationVisibilityShow,
      renderLocations,
      locations,
      doesOverlapSelf,
      start,
      end,
      advancedOptions,
      advancedDefaultOpen,
      upsertAnnotation,
      original_selectionLayerUpdate
    } = this.props;
    const { isProtein } = sequenceData;
    const sequenceLength = sequenceData.sequence.length;
    const annotationLength = getRangeLength(
      locations && locations.length
        ? {
            start: locations[0].start,
            end: locations[locations.length - 1].end
          }
        : { start, end },
      sequenceLength
    );
    return (
      <form
        onSubmit={handleSubmit((data) => {
          let updatedData;
          if (data.forward === true && data.strand !== 1) {
            updatedData = { ...data, strand: 1 };
          } else if (data.forward === false && data.strand !== -1) {
            updatedData = { ...data, strand: -1 };
          } else {
            updatedData = data;
          }
          updatedData.notes = {};
          this.notes.forEach(({ key, value }) => {
            if (!updatedData.notes[key]) updatedData.notes[key] = [];
            updatedData.notes[key].push(value || "");
          });
          if (annotationTypePlural === "features") {
            updatedData.color = featureColors[updatedData.type];
          }
          const hasJoinedLocations =
            updatedData.locations && updatedData.locations.length > 1;

          const newAnnotation = tidyUpAnnotation(
            convertRangeTo0Based({
              doesOverlapSelf: data.doesOverlapSelf,
              ...updatedData,
              ...(annotationTypePlural === "primers" //if we're making a primer it should automatically have a type of primer
                ? { type: "primer" }
                : {}),
              locations: undefined, //by default clear locations
              ...(hasJoinedLocations && {
                //only add locations if there are locations
                start: updatedData.locations[0].start, //override the start and end to use the start and end of the joined locations
                end:
                  updatedData.locations[updatedData.locations.length - 1].end,
                locations: updatedData.locations.map(convertRangeTo0Based)
              })
            }),
            {
              sequenceData,
              annotationType: annotationTypePlural
            }
          );
          beforeAnnotationCreate &&
            beforeAnnotationCreate({
              annotationTypePlural,
              annotation: newAnnotation,
              props: this.props
            });

          //update the selection layer so we don't jump away from where we're editing
          //the original_ is there to differentiate it from the one we override to control the selection layer while in the dialog
          original_selectionLayerUpdate &&
            original_selectionLayerUpdate(newAnnotation);
          upsertAnnotation(newAnnotation);
          annotationVisibilityShow(annotationTypePlural);
          hideModal();
        })}
      >
        <div
          className={classNames(
            Classes.DIALOG_BODY,
            "tg-min-width-dialog",
            "tg-upsert-annotation"
          )}
        >
          <InputField
            disabled={this.props.readOnly}
            inlineLabel
            tooltipError
            autoFocus
            placeholder="Untitled Annotation"
            {...(window.__getDefaultValGenerator &&
              window.__getDefaultValGenerator({
                code: annotationTypePlural + "_name",
                customParams: {
                  isProtein,
                  sequenceName: sequenceData.name,
                  start,
                  end
                }
              }))}
            validate={required}
            name="name"
            label="Name:"
          />
          {!isProtein && (
            <RadioGroupField
              disabled={this.props.readOnly}
              inlineLabel
              tooltipError
              options={[
                { label: "Positive", value: "true" },
                { label: "Negative", value: "false" }
              ]}
              normalize={(value) => value === "true" || false}
              format={(value) => (value ? "true" : "false")}
              name="forward"
              label="Strand:"
              defaultValue={true}
            />
          )}
          {renderTypes || null}
          {renderTags || null}
          {!renderLocations || !locations || locations.length < 2 ? (
            <React.Fragment>
              <div
                style={{ marginBottom: 10, fontSize: 12, fontStyle: "italic" }}
              >
                You can also click or drag in the editor to change the selection{" "}
              </div>
              <NumericInputField
                inlineLabel
                disabled={this.props.readOnly}
                format={this.formatStart}
                parse={this.parseStart}
                tooltipError
                defaultValue={1}
                min={1}
                max={sequenceLength || 1}
                name="start"
                label="Start:"
              />
              <NumericInputField
                disabled={this.props.readOnly}
                format={this.formatEnd}
                parse={this.parseEnd}
                inlineLabel
                tooltipError
                defaultValue={sequenceData.isProtein ? 3 : 1}
                min={1}
                max={sequenceLength || 1}
                name="end"
                label="End:"
              />
            </React.Fragment>
          ) : null}
          {renderLocations ? (
            <FieldArray component={this.renderLocations} name="locations" />
          ) : null}
          <div
            className="bp3-text-muted bp3-text-small"
            style={{ marginBottom: 15, marginTop: -5, fontStyle: "italic" }}
          >
            Length:{" "}
            {doesOverlapSelf
              ? sequenceLength + annotationLength
              : annotationLength}
          </div>
          <Notes readOnly={this.props.readOnly} notes={this.notes}></Notes>
          <Advanced
            advancedDefaultOpen={advancedDefaultOpen}
            advancedOptions={advancedOptions}
          ></Advanced>
          <div
            style={{ display: "flex", justifyContent: "flex-end" }}
            className="width100"
          >
            <Button
              style={{ marginRight: 15 }}
              onMouseDown={(e) => {
                //use onMouseDown to prevent issues with redux form errors popping in and stopping the dialog from closing
                e.preventDefault();
                e.stopPropagation();
                hideModal();
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={this.props.readOnly}
              type={!this.props.readOnly && "submit"}
              intent={Intent.PRIMARY}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    );
  }
}

function required(val) {
  if (!val) return "Required";
}

export default ({ formName, getProps, dialogProps }) => {
  return compose(
    withDialog({
      isDraggable: true,
      width: 350,
      ...dialogProps
    }),
    withEditorProps,
    withProps(getProps),
    reduxForm({
      form: formName, // "AddOrEditAnnotationDialog",
      validate: (values, { sequenceLength, sequenceData }) => {
        let errors = {};
        const { circular } = sequenceData || {};
        if (!circular && values.start > values.end) {
          errors.start = "Start must be less than End for a linear sequence";
          errors.end = "Start must be less than End for a linear sequence";
        }
        if (
          !isRangeWithinRange(
            convertRangeTo0Based(values, sequenceLength),
            { start: 0, end: sequenceLength - 1 },
            sequenceLength
          )
        ) {
          errors.start = "Range must fit within sequence";
          errors.end = "Range must fit within sequence";
        }
        if (values.locations && values.locations.length > 1) {
          const entireLocationSpan = {
            start: values.locations[0].start,
            end: values.locations[values.locations.length - 1].end
          };
          if (entireLocationSpan.start > entireLocationSpan.end && !circular) {
            errors.locations = errors.locations || {};
            errors.locations[0] = {
              start:
                "In a non-circular sequence, joined spans must be in ascending order"
            };
            errors.locations[values.locations.length - 1] = {
              end:
                "In a non-circular sequence, joined spans must be in ascending order"
            };
          }
          values.locations.forEach((loc, index) => {
            // if (!isRangeWithinRange(loc, values, sequenceLength)) {
            //   errors.locations = errors.locations || {};
            //   errors.locations[index] = {
            //     start: "Range must fit within feature",
            //     end: "Range must fit within feature"
            //   };
            // }
            if (index !== 0 && index !== values.locations.length - 1) {
              //it is a middle location so it should fit within the parent location
              if (
                !isRangeWithinRange(loc, entireLocationSpan, sequenceLength)
              ) {
                errors.locations = errors.locations || {};
                errors.locations[index] = {
                  start: "Joined spans must be in ascending order",
                  end: "Joined spans must be in ascending order"
                };
              }
            }
            values.locations.forEach((loc2, index2) => {
              if (loc2 === loc) return;
              if (checkIfPotentiallyCircularRangesOverlap(loc, loc2)) {
                errors.locations = errors.locations || {};
                errors.locations[index] = {
                  start: "Joined spans must not overlap",
                  end: "Joined spans must not overlap"
                };
                errors.locations[index2] = {
                  start: "Joined spans must not overlap",
                  end: "Joined spans must not overlap"
                };
              }
            });
          });
        }

        return errors;
      }
    }),
    formValues("start", "end", "doesOverlapSelf", "locations")
  )(AddOrEditAnnotationDialog);
};

const Notes = view(({ readOnly, notes }) => {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div>Notes: </div>{" "}
        <span style={{ marginLeft: 15, fontSize: 10, color: "grey" }}>
          (Key -- Value)
        </span>{" "}
      </div>
      {map(notes, (note, i) => {
        const { value, key } = note || {};
        return (
          <div
            key={i}
            data-test={"note-" + i}
            style={{ display: "flex", padding: "4px 2px" }}
          >
            <EditableText
              onConfirm={(string) => {
                if (string === "") {
                  if (!note.value) {
                    notes.splice(i, 1);
                  } else {
                    note.key = "note";
                  }
                }
              }}
              disabled={readOnly}
              placeholder="Add key here"
              maxLines={5}
              multiline
              className="addAnnNoteKey"
              // style={{marginRight: 20}}
              onChange={(string) => {
                note.key = string.replace(" ", "_").replace(/\n/g, "");
              }}
              value={key}
            ></EditableText>
            <EditableText
              disabled={readOnly}
              maxLines={10}
              className="addAnnNoteValue"
              multiline
              // style={{
              //   paddingTop: 6,
              //   height: 30,
              //   minHeight: 30,
              //   minWidth: 200,
              //   maxWidth: 200,
              // }}
              onChange={(string) => {
                note.value = string.replace(/\n/g, "");
              }}
              value={value}
            ></EditableText>{" "}
            &nbsp;
            <div>
              <Button
                disabled={readOnly}
                style={{ padding: 2 }}
                onClick={() => {
                  notes.splice(i, 1);
                }}
                minimal
                icon="trash"
              ></Button>
            </div>
          </div>
        );
      })}
      <Button
        disabled={readOnly}
        onClick={() => {
          notes.push({
            key: "note",
            value: ""
          });
        }}
        minimal
        icon="plus"
      >
        {" "}
        Add Note
      </Button>
    </div>
  );
});

function Advanced({ advancedOptions, advancedDefaultOpen }) {
  const [isOpen, setOpen] = useState(advancedDefaultOpen);
  if (!advancedOptions) {
    return null;
  }
  return (
    <div style={{ marginTop: 5 }}>
      <div
        onClick={() => {
          setOpen(!isOpen);
        }}
        style={{ cursor: "pointer" }}
      >
        Advanced <Icon icon={isOpen ? "caret-up" : "caret-down"}></Icon>
      </div>
      {isOpen && <div>{advancedOptions}</div>}
    </div>
  );
}
