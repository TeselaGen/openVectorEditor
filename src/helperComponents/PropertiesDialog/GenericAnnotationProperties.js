import React from "react";
import {
  DataTable,
  withSelectedEntities,
  CmdCheckbox,
  CmdButton
} from "teselagen-react-components";
import { map, upperFirst, pick } from "lodash";
import { Button } from "@blueprintjs/core";
import { getRangeLength } from "ve-range-utils";
// import { Popover } from "@blueprintjs/core";
// import ColorPicker from "./ColorPicker";
import { connectToEditor } from "../../withEditorProps";
import { compose } from "recompose";
import commands from "../../commands";
import { sizeSchema } from "./utils";

const genericAnnotationProperties = ({ annotationType, noColor, noType }) => {
  const schema = {
    fields: [
      ...(noColor
        ? []
        : [
            {
              path: "color",
              type: "string",
              render: color => {
                return (
                  <div style={{ height: 20, width: 20, background: color }} />
                  // <ColorPickerPopover>
                  //   <div style={{ height: 20, width: 20, background: color }} />
                  // </ColorPickerPopover>
                );
              }
            }
          ]),
      { path: "name", type: "string" },
      ...(noType ? [] : [{ path: "type", type: "string" }]),
      sizeSchema,
      { path: "strand", type: "string" }
    ]
  };
  const annotationTypeUpper = upperFirst(annotationType);
  class AnnotationProperties extends React.Component {
    constructor(props) {
      super(props);
      this.commands = commands(this);
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
        annotationPropertiesSelectedEntities: _annotationPropertiesSelectedEntities,
        selectedAnnotationId
      } = this.props;
      const annotationPropertiesSelectedEntities = _annotationPropertiesSelectedEntities.filter(
        a => annotations[a.id]
      );

      const deleteAnnotation = this.props[`delete${annotationTypeUpper}`];
      // showAddOrEditFeatureDialog()
      // showAddOrEditPartDialog()
      // showAddOrEditPrimerDialog()
      const showAddOrEditAnnotationDialog = this.props[
        `showAddOrEdit${annotationTypeUpper}Dialog`
      ];

      const annotationsToUse = map(annotations, annotation => {
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
            compact
            isInfinite
            schema={schema}
            entities={annotationsToUse}
          />
          {!readOnly && (
            <div className="vePropertiesFooter">
              <Button
                disabled={!sequenceLength}
                style={{ marginRight: 15 }}
                onClick={() => {
                  showAddOrEditAnnotationDialog({
                    ...pick(selectionLayer, "start", "end")
                  });
                }}
              >
                New
              </Button>
              <Button
                onClick={() => {
                  showAddOrEditAnnotationDialog(
                    annotationPropertiesSelectedEntities[0]
                  );
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
