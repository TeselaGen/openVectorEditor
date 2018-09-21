import React from "react";
import { DataTable, withSelectedEntities } from "teselagen-react-components";
import { Button } from "@blueprintjs/core";
import { convertRangeTo1Based } from "ve-range-utils";

class GuideTool extends React.Component {
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
      guideTableSelectedEntities,
      clearGuides,
      upsertGuides
    } = this.props;
    const { guides } = this.props.guideTool || {};
    let entities = guides ? Object.values(guides) : null;

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataTable
          noRouter
          noFullscreenButton
          onRowSelect={this.onRowSelect}
          maxHeight={400}
          compact
          isInfinite
          formName={"guideTable"}
          schema={schema}
          entities={entities}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            style={{ marginRight: 15 }}
            onClick={() => {
              clearGuides();
            }}
          >
            Clear Guides
          </Button>
          <Button
            style={{ marginRight: 15 }}
            disabled={!guideTableSelectedEntities.length || !upsertGuides}
            onClick={() => {
              upsertGuides(guideTableSelectedEntities);
            }}
          >
            Save Guides
          </Button>
        </div>
      </div>
    );
  }
}

const schema = {
  fields: [
    { path: "target", displayName: "Target", type: "string" },
    {
      path: "start",
      displayName: "Position",
      type: "string",
      render: (val, record) => {
        const base1Range = convertRangeTo1Based(record);
        return (
          <span>
            ({base1Range.start}-{base1Range.end})
          </span>
        );
      }
    },
    {
      path: "forward",
      displayName: "Strand",
      type: "boolean",
      render: val => (val ? "+" : "-")
    },
    { width: 200, path: "sequence", displayName: "Sequence", type: "string" },
    { path: "pam", displayName: "PAM", type: "string" },
    { path: "onTargetScore", displayName: "On-Target", type: "number" },
    { path: "offTargetScore", displayName: "Off-Target", type: "number" }
  ]
};

export default withSelectedEntities("guideTable")(GuideTool);
