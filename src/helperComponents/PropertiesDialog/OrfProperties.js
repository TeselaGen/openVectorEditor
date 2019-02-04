import React from "react";
import { DataTable, withSelectedEntities } from "teselagen-react-components";
import { map } from "lodash";
// import { Button } from "@blueprintjs/core";
import { getRangeLength, convertRangeTo1Based } from "ve-range-utils";
import { getOrfColor } from "../../constants/orfFrameToColorMap";
import { Switch, Checkbox } from "@blueprintjs/core";
import { connectToEditor } from "../../withEditorProps";
import { compose } from "recompose";
import selectors from "../../selectors";
import { MinOrfSize } from "../../ToolBar/orfTool";

class OrfProperties extends React.Component {
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
      orfs,
      editorName,
      sequenceLength,
      annotationVisibilityToggle,
      annotationVisibility,
      useAdditionalOrfStartCodonsToggle,
      useAdditionalOrfStartCodons
    } = this.props;
    const orfsToUse = map(orfs, orf => {
      return {
        ...orf,
        color: getOrfColor(orf),
        frame: orf.frame + 1,
        ...(orf.strand === undefined && {
          strand: orf.forward ? 1 : -1
        }),
        size: getRangeLength(orf, sequenceLength),
        sizeAa: Math.floor(getRangeLength(orf, sequenceLength) / 3)
      };
    });
    return (
      <React.Fragment>
        <DataTable
          topLeftItems={
            <Switch
              checked={annotationVisibility.orfs}
              onChange={() => {
                this.props.annotationVisibilityToggle("orfs");
              }}
            >
              Hide/Show
            </Switch>
          }
          noPadding
          noFullscreenButton
          onRowSelect={this.onRowSelect}
          withSearch={false}
          maxHeight={400}
          formName="orfProperties"
          noRouter
          compact
          isInfinite
          schema={{
            fields: [
              {
                path: "color",
                type: "string",
                render: color => {
                  return (
                    <div style={{ height: 20, width: 20, background: color }} />
                  );
                }
              },
              {
                path: "sizeAa",
                displayName: "Size (aa)",
                type: "string"
              },
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
              { path: "frame", type: "number" },
              { path: "strand", type: "number" }
            ]
          }}
          entities={orfsToUse}
        />
        <MinOrfSize editorName={editorName} />

        <Checkbox
          disabled={!annotationVisibility.orfs}
          style={{ marginTop: 10 }}
          onChange={function() {
            annotationVisibilityToggle("orfTranslations");
          }}
          checked={annotationVisibility.orfTranslations}
          label="Show translations for ORFs"
        />

        <Checkbox
          onChange={useAdditionalOrfStartCodonsToggle}
          checked={useAdditionalOrfStartCodons}
          label="Use GTG and CTG as start codons"
        />
      </React.Fragment>
    );
  }
}

export default compose(
  connectToEditor(editorState => {
    const {
      readOnly,
      annotationVisibility = {},
      sequenceData: { sequence = "" } = {}
    } = editorState;
    return {
      readOnly,
      annotationVisibility,
      orfs: selectors.orfsSelector(editorState),
      sequenceLength: sequence.length
    };
  }),
  withSelectedEntities("orfProperties")
)(OrfProperties);
