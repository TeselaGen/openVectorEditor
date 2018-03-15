import React from "react";
import { DataTable, withSelectedEntities } from "teselagen-react-components";
import { map } from "lodash";
import { Button } from "@blueprintjs/core";
import { getRangeLength, convertRangeTo1Based } from "ve-range-utils";

class PrimerProperties extends React.Component {
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
      sequenceData = {},
      primerPropertiesSelectedEntities,
      showAddOrEditPrimerDialog,
      deletePrimer,
      selectedAnnotationId
    } = this.props;
    const { primers } = sequenceData;
    const primersToUse = map(primers, primer => {
      return {
        ...primer,
        ...(primer.strand === undefined && {
          strand: primer.forward ? 1 : -1
        }),
        size: getRangeLength(primer, sequenceData.sequence.length)
      };
    });
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataTable
          noPadding
          onRowSelect={this.onRowSelect}
          selectedIds={selectedAnnotationId}
          maxHeight={400}
          formName={"primerProperties"}
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
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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

export default withSelectedEntities("primerProperties")(PrimerProperties);
