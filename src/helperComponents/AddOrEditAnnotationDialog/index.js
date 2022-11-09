import React from "react";

import { reduxForm, FieldArray } from "redux-form";

import {
  InputField,
  RadioGroupField,
  NumericInputField,
  wrapDialog,
  AdvancedOptions,
  generateField,
  reverseFeatureIcon,
  bluntFeatureIcon,
  featureIcon
} from "teselagen-react-components";
import { compose } from "redux";
import {
  Button,
  Intent,
  Classes,
  EditableText,
  FormGroup,
  Label
} from "@blueprintjs/core";
import {
  convertRangeTo0Based,
  isRangeWithinRange,
  checkIfPotentiallyCircularRangesOverlap,
  getRangeLength
} from "ve-range-utils";
import { tidyUpAnnotation, getFeatureToColorMap } from "ve-sequence-utils";
import classNames from "classnames";
import { store, view } from "@risingstack/react-easy-state";

import withEditorProps from "../../withEditorProps";
import { withProps } from "recompose";
import { map, flatMap } from "lodash";
import "./style.css";
import tgFormValues from "../../utils/tgFormValues";

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
            <Label>Joined Feature Spans</Label>
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
                        className="no-inline-label-margins"
                        tooltipError
                        min={1}
                        format={this.formatStart}
                        parse={this.parseStart}
                        max={sequenceLength || 1}
                        name={`${member}.start`}
                        label="Start"
                      />
                      <NumericInputField
                        disabled={this.props.readOnly}
                        containerStyle={{ marginBottom: 0, marginRight: 10 }}
                        inlineLabel
                        className="no-inline-label-margins"
                        tooltipError
                        min={1}
                        format={this.formatEnd}
                        parse={this.parseEnd}
                        max={sequenceLength || 1}
                        name={`${member}.end`}
                        label="End"
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
      defaultLinkedOligoMessage,
      hideModal,
      sequenceData = { sequence: "" },
      handleSubmit,
      beforeAnnotationCreate,
      renderTypes,
      renderTags,
      RenderBases,
      allowMultipleFeatureDirections,
      getLinkedOligoLink,
      allowPrimerBasesToBeEdited,
      bases,
      initialValues,
      forward,
      primerBindsOn,
      useLinkedOligo,
      submitting,
      change,
      annotationTypePlural,
      annotationVisibilityShow,
      renderLocations,
      locations,
      overlapsSelf,
      start,
      end,
      getAdditionalEditAnnotationComps,
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
        onSubmit={handleSubmit(async (data) => {
          let updatedData;
          const forward =
            data.forward !== undefined
              ? data.forward
              : data.arrowheadType !== "BOTTOM";
          // if (data.arrowheadType === "BOTH") {
          //   data.arrowheadType = "BOTH";
          // }
          // if (data.arrowheadType === "NONE") {
          //   data.arrowheadType = "NONE";
          // }
          // delete data.arrowheadType;
          if (
            annotationTypePlural === "features" &&
            allowMultipleFeatureDirections
          ) {
            updatedData = {
              ...data,
              strand: data.arrowheadType === "BOTTOM" ? -1 : 1
            };
            delete updatedData.forward;
          } else {
            if (forward === true && data.strand !== 1) {
              updatedData = { ...data, strand: 1 };
            } else if (forward === false && data.strand !== -1) {
              updatedData = { ...data, strand: -1 };
            } else {
              updatedData = data;
            }
          }
          if (!data.useLinkedOligo) {
            delete updatedData.bases;
          }
          updatedData.notes = {};
          this.notes.forEach(({ key, value }) => {
            if (!updatedData.notes[key]) updatedData.notes[key] = [];
            updatedData.notes[key].push(value || "");
          });
          if (annotationTypePlural === "features") {
            updatedData.color = getFeatureToColorMap[updatedData.type];
          }
          const hasJoinedLocations =
            updatedData.locations && updatedData.locations.length > 1;

          const newAnnotation = tidyUpAnnotation(
            convertRangeTo0Based({
              overlapsSelf: data.overlapsSelf,
              ...updatedData,
              ...(annotationTypePlural === "primers" //if we're making a primer it should automatically have a type of primer
                ? { type: "primer_bind" }
                : {}),
              locations: undefined, //by default clear locations
              ...(hasJoinedLocations && {
                //only add locations if there are locations
                start: updatedData.locations[0].start, //override the start and end to use the start and end of the joined locations
                end: updatedData.locations[updatedData.locations.length - 1]
                  .end,
                locations: updatedData.locations.map(convertRangeTo0Based)
              })
            }),
            {
              sequenceData,
              annotationType: annotationTypePlural
            }
          );

          if (beforeAnnotationCreate) {
            const shouldContinue = await beforeAnnotationCreate({
              annotationTypePlural,
              annotation: newAnnotation,
              props: this.props,
              isEdit: !!this.props.initialValues.id
            });
            if (shouldContinue === false) return;
          }

          //update the selection layer so we don't jump away from where we're editing
          //the original_ is there to differentiate it from the one we override to control the selection layer while in the dialog
          original_selectionLayerUpdate &&
            original_selectionLayerUpdate({
              overlapsSelf: data.overlapsSelf,
              start: newAnnotation.start,
              end: newAnnotation.end
            });
          upsertAnnotation(newAnnotation);
          annotationVisibilityShow(annotationTypePlural);
          hideModal();
        })}
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
          label="Name"
        />
        {!isProtein &&
          (annotationTypePlural === "features" &&
          allowMultipleFeatureDirections ? (
            <StrandField
              name="arrowheadType"
              label="Strand"
              disabled={this.props.readOnly}
              inlineLabel
              inline
              tooltipError
            ></StrandField>
          ) : (
            <RadioGroupField
              disabled={this.props.readOnly}
              inlineLabel
              inline
              tooltipError
              options={[
                { label: "Positive", value: "true" },
                { label: "Negative", value: "false" }
              ]}
              normalize={(value) => value === "true" || false}
              format={(value) => (value ? "true" : "false")}
              name="forward"
              label="Strand"
            />
          ))}

        {renderTypes || null}
        {renderTags || null}

        {/* {allowPrimerBasesToBeEdited && RenderBases ? null : !renderLocations || */}
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
              label={`${
                annotationTypePlural === "primers" ? "Bind " : ""
              }Start`}
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
              label={`${annotationTypePlural === "primers" ? "Bind " : ""}End`}
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
          {`${
            annotationTypePlural === "primers" ? "Binding Site " : ""
          }Length: `}

          {overlapsSelf ? sequenceLength + annotationLength : annotationLength}
        </div>
        {allowPrimerBasesToBeEdited && RenderBases ? (
          <RenderBases
            {...{
              // ...this.props,
              bases,
              defaultLinkedOligoMessage,
              getLinkedOligoLink,
              readOnly: this.props.readOnly,
              sequenceData,
              start,
              end,
              initialValues,
              sequenceLength,
              primerBindsOn,
              forward,
              linkedOligo: initialValues.linkedOligo,
              useLinkedOligo,
              change
            }}
          ></RenderBases>
        ) : null}
        {getAdditionalEditAnnotationComps &&
          getAdditionalEditAnnotationComps(this.props)}
        <Notes readOnly={this.props.readOnly} notes={this.notes}></Notes>

        <AdvancedOptions isOpenByDefault={advancedDefaultOpen}>
          {advancedOptions}
        </AdvancedOptions>
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
            type="submit"
            loading={submitting}
            disabled={this.props.readOnly}
            intent={Intent.PRIMARY}
          >
            Save
          </Button>
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
    wrapDialog({
      isDraggable: true,
      width: 400,
      ...dialogProps
    }),
    withEditorProps,
    withProps(getProps),
    reduxForm({
      form: formName, // "AddOrEditAnnotationDialog",
      validate: (values, { sequenceLength, sequenceData }) => {
        const errors = {};
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
              end: "In a non-circular sequence, joined spans must be in ascending order"
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
    tgFormValues(
      "start",
      "end",
      "overlapsSelf",
      "locations",
      "bases",
      "useLinkedOligo",
      "forward",
      "primerBindsOn"
    )
  )(AddOrEditAnnotationDialog);
};

const Notes = view(({ readOnly, notes }) => {
  return (
    <div>
      <FormGroup
        style={{ marginBottom: 0 }}
        inline
        label="Notes"
        labelInfo="(Key -- Value)"
      ></FormGroup>

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

const StrandField = generateField(({ input }) => {
  return (
    <>
      <Button
        title="Bottom"
        className="tg-arrowheadType-BOTTOM"
        active={input.value === "BOTTOM"}
        minimal
        style={{ marginRight: 20 }}
        onClick={() => input.onChange("BOTTOM")}
        icon={reverseFeatureIcon}
      ></Button>
      {/* <Button
        title="Bi-Directional"
        className={'tg-arrowheadType-BOTH-'}
        onClick={() => input.onChange("BOTH")}
        minimal
        active={input.value === "BOTH"}
        icon="arrows-horizontal"
      ></Button> */}
      <Button
        title="No Direction"
        className="tg-arrowheadType-NONE"
        active={input.value === "NONE"}
        minimal
        style={{ marginRight: 20 }}
        onClick={() => input.onChange("NONE")}
        icon={bluntFeatureIcon}
      ></Button>
      <Button
        title="Top"
        className="tg-arrowheadType-TOP"
        onClick={() => input.onChange("TOP")}
        minimal
        active={input.value === "TOP"}
        icon={featureIcon}
      ></Button>
    </>
  );
});
