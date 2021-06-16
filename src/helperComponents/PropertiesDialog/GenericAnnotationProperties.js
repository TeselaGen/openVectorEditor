import React from "react";
import {
  DataTable,
  withSelectedEntities,
  CmdCheckbox,
  CmdButton,
  getTagProps,
  getKeyedTagsAndTagOptions
} from "teselagen-react-components";
import { map, upperFirst, pick } from "lodash";
import { Button, Tag } from "@blueprintjs/core";
import { getRangeLength } from "ve-range-utils";
// import { Popover } from "@blueprintjs/core";
// import ColorPicker from "./ColorPicker";
import { connectToEditor } from "../../withEditorProps";
import { compose } from "recompose";
import commands from "../../commands";
import { sizeSchema } from "./utils";
import { showAddOrEditAnnotationDialog } from "../../GlobalDialogUtils";
import { typeField } from "./typeField";

const genericAnnotationProperties = ({
  annotationType,
  noType,
  withTags
}) => {
  const annotationTypeUpper = upperFirst(annotationType);
  class AnnotationProperties extends React.Component {
    constructor(props) {
      super(props);
      this.commands = commands(this);
      this.schema = {
        fields: [
          { path: "name", type: "string" },
          ...(noType
            ? []
            : [
                typeField
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
          { path: "strand", type: "string" }
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
        isProtein,
        allPartTags,
        annotationPropertiesSelectedEntities: _annotationPropertiesSelectedEntities,
        selectedAnnotationId
      } = this.props;
      const annotationPropertiesSelectedEntities = _annotationPropertiesSelectedEntities.filter(
        (a) => annotations[a.id]
      );

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
              <CmdCheckbox
                prefix="Show "
                cmd={this.commands[`toggle${annotationTypeUpper + "s"}`]}
              />
            }
            annotationVisibility={annotationVisibility} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
            noPadding
            noFullscreenButton
            onRowSelect={this.onRowSelect}
            maxHeight={400}
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
          {!readOnly && (
            <div className="vePropertiesFooter">
              <Button
                disabled={!sequenceLength}
                style={{ marginRight: 15 }}
                onClick={() => {
                  showAddOrEditAnnotationDialog({
                    type: annotationType,
                    annotation: pick(selectionLayer, "start", "end", "forward")
                  });
                }}
              >
                New
              </Button>
              <Button
                onClick={() => {
                  showAddOrEditAnnotationDialog({
                    type: annotationType,
                    annotation: annotationPropertiesSelectedEntities[0]
                  });
                }}
                style={{ marginRight: 15 }}
                disabled={annotationPropertiesSelectedEntities.length !== 1}
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  deleteAnnotation(annotationPropertiesSelectedEntities);
                }}
                style={{ marginRight: 15 }}
                disabled={!annotationPropertiesSelectedEntities.length}
              >
                Delete
              </Button>
              {["part", "primer", "feature"].includes(annotationType) && (
                <CmdButton
                  cmd={
                    this.commands[
                      `showRemoveDuplicatesDialog${annotationTypeUpper + "s"}`
                    ]
                  }
                  style={{ marginRight: 15 }}
                />
              )}
            </div>
          )}
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
        selectionLayer
      }) => {
        return {
          annotationVisibility,
          selectionLayer,
          readOnly,
          annotations: sequenceData[annotationType + "s"],
          [annotationType + "s"]: sequenceData[annotationType + "s"],
          sequenceLength: sequenceData.sequence.length
        };
      }
    ),
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
