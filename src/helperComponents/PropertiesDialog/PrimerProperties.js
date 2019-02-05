import React from "react";
import {
  DataTable,
  withSelectedEntities,
  CmdCheckbox
} from "teselagen-react-components";
import { map } from "lodash";
import { Button } from "@blueprintjs/core";
import { getRangeLength, convertRangeTo1Based } from "ve-range-utils";
import { connectToEditor } from "../../withEditorProps";
import { compose } from "recompose";
import commands from "../../commands";
class PrimerProperties extends React.Component {
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
      sequenceLength,
      primers,
      annotationVisibility,
      primerPropertiesSelectedEntities,
      showAddOrEditPrimerDialog,
      deletePrimer,
      selectedAnnotationId
    } = this.props;
    const primersToUse = map(primers, primer => {
      return {
        ...primer,
        ...(primer.strand === undefined && {
          strand: primer.forward ? 1 : -1
        }),
        size: getRangeLength(primer, sequenceLength)
      };
    });
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataTable
          topLeftItems={
            <CmdCheckbox prefix="Show " cmd={this.commands.togglePrimers} />
          }
          annotationVisibility={annotationVisibility} //we need to pass this in order to force the DT to rerender
          noPadding
          noFullscreenButton
          onRowSelect={this.onRowSelect}
          selectedIds={selectedAnnotationId}
          maxHeight={400}
          formName="primerProperties"
          noRouter
          compact
          isInfinite
          schema={{
            fields: [
              { path: "name", type: "string" },
              { path: "type", type: "string" },
              {
                path: "size",
                type: "string",
                render: (val, record) => {
                  const base1Range = convertRangeTo1Based(record);
                  return (
                    <span>
                      {val}{" "}
                      <span style={{ fontSize: 10 }}>
                        ({base1Range.start}-{base1Range.end})
                      </span>
                    </span>
                  );
                }
              },
              { path: "strand", type: "string" }
            ]
          }}
          entities={primersToUse}
        />
        {!readOnly && (
          <div className="vePropertiesFooter">
            <Button
              style={{ marginRight: 15 }}
              onClick={() => {
                showAddOrEditPrimerDialog();
              }}
            >
              New
            </Button>
            <Button
              onClick={() => {
                showAddOrEditPrimerDialog(primerPropertiesSelectedEntities[0]);
              }}
              style={{ marginRight: 15 }}
              disabled={primerPropertiesSelectedEntities.length !== 1}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                deletePrimer(primerPropertiesSelectedEntities);
              }}
              style={{ marginRight: 15 }}
              disabled={!primerPropertiesSelectedEntities.length}
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
      sequenceData: { sequence = "", primers = {} } = {}
    }) => {
      return {
        readOnly,
        annotationVisibility,
        primers,
        sequenceLength: sequence.length
      };
    }
  ),
  withSelectedEntities("primerProperties")
)(PrimerProperties);
