import React from "react";
import {
  DataTable,
  withSelectedEntities,
  CmdButton,
  getTagProps,
  getKeyedTagsAndTagOptions,
  DropdownButton,
  createCommandMenu
} from "teselagen-react-components";
import { map, upperFirst, pick, startCase, isFunction } from "lodash";
import {
  AnchorButton,
  Button,
  ButtonGroup,
  Icon,
  Menu,
  Tag
} from "@blueprintjs/core";
import { getRangeLength } from "ve-range-utils";
// import { Popover } from "@blueprintjs/core";
// import ColorPicker from "./ColorPicker";
import { connectToEditor } from "../../withEditorProps";
import { compose } from "recompose";
import commands from "../../commands";
import { sizeSchema } from "./utils";
import { showAddOrEditAnnotationDialog } from "../../GlobalDialogUtils";
import { typeField } from "./typeField";
import { getSequenceWithinRange } from "ve-range-utils";
import { getReverseComplementSequenceString } from "ve-sequence-utils";

const genericAnnotationProperties = ({
  annotationType,
  noType,
  visSubmenu,
  withTags,
  withBases,
  additionalFooterEls
}) => {
  const annotationTypeUpper = upperFirst(annotationType);
  class AnnotationProperties extends React.Component {
    constructor(props) {
      super(props);
      this.commands = commands(this);
      this.schema = {
        fields: [
          {
            path: "name",
            type: "string",

            render: (name, ann, row, props) => {
              const checked =
                !props.annotationVisibility[
                  `${annotationType}IndividualToHide`
                ][ann.id];

              return (
                <>
                  <Icon
                    data-tip="Hide/Show"
                    onClick={(e) => {
                      e.stopPropagation();
                      const upperType = startCase(annotationType);
                      if (checked) {
                        props[`hide${upperType}Individual`]([ann.id]);
                      } else {
                        props[`show${upperType}Individual`]([ann.id]);
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      marginRight: 4,
                      marginTop: 3,
                      color: "darkgray"
                    }}
                    icon={`eye-${checked ? "open" : "off"}`}
                  ></Icon>
                  {name}
                </>
              );
            }
          },

          ...(!withBases
            ? []
            : [
                {
                  path: "bases",
                  type: "string",
                  render: (bases, primer, row, props) => {
                    let bps = bases;
                    if (!bases) {
                      bps = getSequenceWithinRange(primer, props.sequence);
                      if (!primer.forward) {
                        bps = getReverseComplementSequenceString(bps);
                      }
                    }
                    return bps;
                  }
                }
              ]),
          ...(noType
            ? []
            : [
                typeField,
                {
                  path: "color",
                  type: "string",
                  width: 50,
                  render: (color) => {
                    return (
                      <div
                        style={{ height: 20, width: 20, background: color }}
                      />
                      // <ColorPickerPopover>
                      //   <div style={{ height: 20, width: 20, background: color }} />
                      // </ColorPickerPopover>
                    );
                  }
                }
              ]),
          sizeSchema,
          ...(withTags && this.props.allPartTags
            ? [
                {
                  path: "tags",
                  type: "string",
                  getValueToFilterOn: (o, { keyedPartTags }) => {
                    const toRet = (o.tags || [])
                      .map((tagId) => {
                        const tag = keyedPartTags[tagId];
                        if (!tag) return "";
                        return tag.label;
                      })
                      .join(" ");
                    return toRet;
                  },
                  render: (tags, b, c, { keyedPartTags = {} }) => {
                    return (
                      <div style={{ display: "flex" }}>
                        {(tags || []).map((tagId, i) => {
                          const tag = keyedPartTags[tagId];
                          if (!tag) return null;
                          return <Tag key={i} {...getTagProps(tag)}></Tag>;
                        })}
                      </div>
                    );
                  }
                }
              ]
            : []),
          { path: "strand", type: "number" }
        ]
      };
    }
    onRowSelect = ([record]) => {
      if (!record) return;
      const { dispatch, editorName } = this.props;
      dispatch({
        type: "SELECTION_LAYER_UPDATE",
        payload: record,
        meta: {
          editorName
        }
      });
    };
    render() {
      const {
        readOnly,
        annotations = {},
        annotationVisibility,
        sequenceLength,
        selectionLayer,
        sequence,
        isProtein,
        allPartTags,
        annotationPropertiesSelectedEntities:
          _annotationPropertiesSelectedEntities,
        selectedAnnotationId
      } = this.props;
      const annotationPropertiesSelectedEntities =
        _annotationPropertiesSelectedEntities.filter((a) => annotations[a.id]);

      const deleteAnnotation = this.props[`delete${annotationTypeUpper}`];

      const annotationsToUse = map(annotations, (annotation) => {
        return {
          ...annotation,
          ...(annotation.strand === undefined && {
            strand: annotation.forward ? 1 : -1
          }),
          size: getRangeLength(annotation, sequenceLength)
        };
      });

      return (
        <React.Fragment>
          <DataTable
            topLeftItems={
              <DropdownButton
                style={{ marginTop: 3 }}
                icon="eye-open"
                data-tip="Visibility Filter"
                menu={
                  <Menu>
                    {createCommandMenu(
                      isFunction(visSubmenu)
                        ? visSubmenu(this.props)
                        : visSubmenu,
                      this.commands,
                      {
                        useTicks: true
                      }
                    )}
                  </Menu>
                }
              ></DropdownButton>
            }
            leftOfSearchBarItems={
              <>
                {!readOnly && (
                  <ButtonGroup style={{ marginTop: 3, marginRight: 4 }}>
                    <Button
                      data-tip="New"
                      disabled={!sequenceLength}
                      icon="plus"
                      onClick={() => {
                        showAddOrEditAnnotationDialog({
                          type: annotationType,
                          annotation: pick(
                            selectionLayer,
                            "start",
                            "end",
                            "forward"
                          )
                        });
                      }}
                    ></Button>
                    <AnchorButton
                      onClick={() => {
                        showAddOrEditAnnotationDialog({
                          type: annotationType,
                          annotation: annotationPropertiesSelectedEntities[0]
                        });
                      }}
                      disabled={
                        annotationPropertiesSelectedEntities.length !== 1
                      }
                      data-tip="Edit"
                      icon="edit"
                    ></AnchorButton>

                    {["feature"].includes(annotationType) && (
                      <CmdButton
                        cmd={this.commands.onConfigureFeatureTypesClick}
                      />
                    )}
                    {["part", "primer", "feature"].includes(annotationType) && (
                      <CmdButton
                        text=""
                        icon="clean"
                        data-tip="Remove Duplicates"
                        cmd={
                          this.commands[
                            `showRemoveDuplicatesDialog${
                              annotationTypeUpper + "s"
                            }`
                          ]
                        }
                      />
                    )}

                    {additionalFooterEls && additionalFooterEls(this.props)}
                    <Button
                      onClick={() => {
                        deleteAnnotation(annotationPropertiesSelectedEntities);
                      }}
                      intent="danger"
                      disabled={!annotationPropertiesSelectedEntities.length}
                      data-tip="Delete"
                      icon="trash"
                    ></Button>
                  </ButtonGroup>
                )}
                {/* {createCommandMenu(
                  {
                    cmd: "featureFilterIndividualCmd",
                    // text: 'hahah',
                    shouldDismissPopover: false
                  },
                  this.commands,
                  {
                    useTicks: true
                  }
                )} */}
                {/* <CmdCheckbox
                  prefix="Show "
                  cmd={this.commands.featureFilterIndividualCmd}
                /> */}
              </>
            }
            onDoubleClick={(annotation) => {
              showAddOrEditAnnotationDialog({
                type: annotationType,
                annotation
              });
            }}
            withCheckboxes
            showFeatureIndividual={this.props.showFeatureIndividual} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
            hideFeatureIndividual={this.props.hideFeatureIndividual} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
            showPartIndividual={this.props.showPartIndividual} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
            hidePartIndividual={this.props.hidePartIndividual} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
            showPrimerIndividual={this.props.showPrimerIndividual} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
            hidePrimerIndividual={this.props.hidePrimerIndividual} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
            annotationVisibility={annotationVisibility} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
            featureLengthsToHide={this.props.featureLengthsToHide} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
            primerLengthsToHide={this.props.primerLengthsToHide} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
            partLengthsToHide={this.props.partLengthsToHide} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
            sequence={sequence} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
            noPadding
            noFullscreenButton
            onRowSelect={this.onRowSelect}
            selectedIds={selectedAnnotationId}
            formName="annotationProperties"
            noRouter
            isProtein={isProtein}
            keyedPartTags={getKeyedTagsAndTagOptions(allPartTags)}
            compact
            isInfinite
            schema={this.schema}
            entities={annotationsToUse}
          />
        </React.Fragment>
      );
    }
  }

  return compose(
    connectToEditor(
      ({
        readOnly,
        annotationVisibility = {},
        sequenceData,
        selectionLayer,
        featureLengthsToHide,
        primerLengthsToHide,
        partLengthsToHide
      }) => {
        return {
          annotationVisibility,
          selectionLayer,
          readOnly,
          featureLengthsToHide,
          primerLengthsToHide,
          partLengthsToHide,
          sequenceData,
          sequence: sequenceData.sequence,
          annotations: sequenceData[annotationType + "s"],
          [annotationType + "s"]: sequenceData[annotationType + "s"],
          sequenceLength: sequenceData.sequence.length
        };
      }
    ),
    // withEditorProps,
    withSelectedEntities("annotationProperties")
  )(AnnotationProperties);
};

export default genericAnnotationProperties;

// const ColorPickerPopover = ({ readOnly, onColorSelect, children }) => {
//   return (
//     <Popover
//       disabled={readOnly}
//       content={<ColorPicker onColorSelect={onColorSelect} />}
//     >
//       {children}
//     </Popover>
//   );
// };
