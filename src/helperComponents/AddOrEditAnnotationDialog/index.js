import React from "react";

import { reduxForm, FieldArray, formValues } from "redux-form";

import {
  InputField,
  RadioGroupField,
  NumericInputField,
  TextareaField,
  withDialog
} from "teselagen-react-components";
import { compose } from "redux";
import { Button, Intent, Classes } from "@blueprintjs/core";
import {
  convertRangeTo0Based,
  isRangeWithinRange,
  checkIfPotentiallyCircularRangesOverlap
} from "ve-range-utils";
import { tidyUpAnnotation, featureColors } from "ve-sequence-utils";
import classNames from "classnames";

import withEditorProps from "../../withEditorProps";
import { withProps } from "recompose";

class AddOrEditAnnotationDialog extends React.Component {
  formatStart = val => {
    const { isProtein } = this.props.sequenceData || {};
    if (isProtein) {
      return (val + 2) / 3;
    }
    return val;
  };
  formatEnd = val => {
    const { isProtein } = this.props.sequenceData || {};
    if (isProtein) {
      return val / 3;
    }
    return val;
  };
  parseStart = val => {
    const { isProtein } = this.props.sequenceData || {};
    if (isProtein) {
      return val * 3 - 2;
    }
    return val;
  };
  parseEnd = val => {
    const { isProtein } = this.props.sequenceData || {};
    if (isProtein) {
      return val * 3;
    }
    return val;
  };
  renderLocations = props => {
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
      renderTypes,
      annotationTypePlural,
      annotationVisibilityShow,
      renderLocations,
      locations,
      upsertAnnotation
    } = this.props;
    const sequenceLength = sequenceData.sequence.length;
    return (
      <div
        className={classNames(
          Classes.DIALOG_BODY,
          "tg-min-width-dialog",
          "tg-upsert-annotation"
        )}
      >
        <InputField
          inlineLabel
          tooltipError
          autoFocus
          placeholder="Untitled Annotation"
          validate={required}
          name="name"
          label="Name:"
        />
        <RadioGroupField
          inlineLabel
          tooltipError
          options={[
            { label: "Positive", value: "true" },
            { label: "Negative", value: "false" }
          ]}
          normalize={value => value === "true" || false}
          format={value => (value ? "true" : "false")}
          name="forward"
          label="Strand:"
          defaultValue={true}
        />
        {renderTypes || null}
        {!renderLocations || !locations || locations.length < 2 ? (
          <React.Fragment>
            <NumericInputField
              inlineLabel
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
        <TextareaField
          inlineLabel
          tooltipError
          name="notes"
          label="Notes:"
          format={v => {
            let toReturn = v;
            if (typeof v !== "string" && v) {
              toReturn = "";
              Object.keys(v).forEach(key => {
                let stringVal;
                try {
                  stringVal = JSON.stringify(v[key]);
                } catch (e) {
                  stringVal = v[key];
                }
                toReturn += `- ${key}: ${stringVal} \n`;
              });
            }
            return toReturn;
          }}
          placeholder="Enter notes here.."
        />
        <div
          style={{ display: "flex", justifyContent: "flex-end" }}
          className="width100"
        >
          <Button
            style={{ marginRight: 15 }}
            onMouseDown={e => {
              //use onMouseDown to prevent issues with redux form errors popping in and stopping the dialog from closing
              e.preventDefault();
              e.stopPropagation();
              hideModal();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(data => {
              let updatedData;
              if (data.forward === true && data.strand !== 1) {
                updatedData = { ...data, strand: 1 };
              } else if (data.forward === false && data.strand !== -1) {
                updatedData = { ...data, strand: -1 };
              } else {
                updatedData = data;
              }
              if (annotationTypePlural === "features") {
                updatedData.color = featureColors[updatedData.type];
              }
              const hasJoinedLocations =
                updatedData.locations && updatedData.locations.length > 1;

              const newFeat = tidyUpAnnotation(
                convertRangeTo0Based({
                  ...updatedData,
                  ...(annotationTypePlural === "primers" //if we're making a primer it should automatically have a type of primer
                    ? { type: "primer" }
                    : {}),
                  locations: undefined, //by default clear locations
                  ...(hasJoinedLocations && {
                    //only add locations if there are locations
                    start: updatedData.locations[0].start, //override the start and end to use the start and end of the joined locations
                    end:
                      updatedData.locations[updatedData.locations.length - 1]
                        .end,
                    locations: updatedData.locations.map(convertRangeTo0Based)
                  })
                }),
                {
                  sequenceData,
                  annotationType: "features"
                }
              );
              upsertAnnotation(newFeat);
              annotationVisibilityShow(annotationTypePlural);
              hideModal();
            })}
            intent={Intent.PRIMARY}
          >
            Save
          </Button>
        </div>
      </div>
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
    formValues("start", "end", "locations")
  )(AddOrEditAnnotationDialog);
};
