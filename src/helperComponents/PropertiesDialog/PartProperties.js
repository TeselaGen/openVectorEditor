import React from "react";
import {
  CmdCheckbox,
  DataTable,
  withSelectedEntities
} from "teselagen-react-components";
import { map } from "lodash";
import { Button } from "@blueprintjs/core";
import { getRangeLength } from "ve-range-utils";
import { connectToEditor } from "../../withEditorProps";
import { compose } from "recompose";
import commands from "../../commands";
import { sizeSchema } from "./utils";
class PartProperties extends React.Component {
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
      parts,
      sequenceLength,
      partPropertiesSelectedEntities,
      showAddOrEditPartDialog,
      deletePart,
      isProtein,
      annotationVisibility,
      selectedAnnotationId
    } = this.props;
    const partsToUse = map(parts, part => {
      return {
        ...part,
        ...(part.strand === undefined && {
          strand: part.forward ? 1 : -1
        }),
        size: getRangeLength(part, sequenceLength)
      };
    });
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataTable
          topLeftItems={
            <CmdCheckbox prefix="Show " cmd={this.commands.toggleParts} />
          }
          annotationVisibility={annotationVisibility} //we need to pass this in order to force the DT to rerender
          noPadding
          noFullscreenButton
          onRowSelect={this.onRowSelect}
          selectedIds={selectedAnnotationId}
          maxHeight={400}
          formName="partProperties"
          noRouter
          compact
          isProtein={isProtein}
          isInfinite
          schema={{
            fields: [
              { path: "name", type: "string" },
              sizeSchema,
              { path: "strand", type: "string" }
            ]
          }}
          entities={partsToUse}
        />
        {!readOnly && (
          <div className="vePropertiesFooter">
            <Button
              style={{ marginRight: 15 }}
              onClick={() => {
                showAddOrEditPartDialog();
              }}
            >
              New
            </Button>
            <Button
              onClick={() => {
                showAddOrEditPartDialog(partPropertiesSelectedEntities[0]);
              }}
              style={{ marginRight: 15 }}
              disabled={partPropertiesSelectedEntities.length !== 1}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                deletePart(partPropertiesSelectedEntities);
              }}
              style={{ marginRight: 15 }}
              disabled={!partPropertiesSelectedEntities.length}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  connectToEditor(
    ({
      readOnly,
      annotationVisibility = {},
      sequenceData: { sequence = "", parts = {} } = {}
    }) => {
      return {
        readOnly,
        parts,
        annotationVisibility,
        sequenceLength: sequence.length
      };
    }
  ),
  withSelectedEntities("partProperties")
)(PartProperties);
