import React from "react";
import { DataTable, withSelectedEntities } from "teselagen-react-components";
import { map } from "lodash";
import { Button } from "@blueprintjs/core";
import { getRangeLength, convertRangeTo1Based } from "ve-range-utils";

class PartProperties extends React.Component {
  onRowSelect = ([record]) => {
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
      partPropertiesSelectedEntities,
      showAddOrEditPartDialog,
      deletePart
    } = this.props;
    const { parts } = sequenceData;
    const partsToUse = map(parts, part => {
      return {
        ...part,
        ...(part.strand === undefined && {
          strand: part.forward ? 1 : -1
        }),
        size: getRangeLength(part, sequenceData.sequence.length)
      };
    });
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataTable
          withCheckboxes
          noPadding
          onRowSelect={this.onRowSelect}
          maxHeight={400}
          formName={"partProperties"}
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
          entities={partsToUse}
        />
        {!readOnly && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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

export default withSelectedEntities("partProperties")(PartProperties);
