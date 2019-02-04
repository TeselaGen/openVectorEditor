import React from "react";
import {
  DataTable,
  withSelectedEntities,
  CmdCheckbox,
  CmdDiv
} from "teselagen-react-components";
import { map } from "lodash";
// import { Button } from "@blueprintjs/core";
import { getRangeLength, convertRangeTo1Based } from "ve-range-utils";
import { getOrfColor } from "../../constants/orfFrameToColorMap";
import { connectToEditor } from "../../withEditorProps";
import { compose } from "recompose";
import selectors from "../../selectors";

import getCommands from "../../commands";

class OrfProperties extends React.Component {
  constructor(props) {
    super(props);
    this.commands = getCommands(this);
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
    const { orfs, sequenceLength } = this.props;
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
            <CmdCheckbox prefix="Show " cmd={this.commands.toggleOrfs} />
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

        <br />
        <CmdCheckbox prefix="Show " cmd={this.commands.toggleOrfTranslations} />
        <CmdCheckbox cmd={this.commands.useGtgAndCtgAsStartCodons} />
        <CmdDiv cmd={this.commands.minOrfSizeCmd} />
      </React.Fragment>
    );
  }
}

export default compose(
  connectToEditor(editorState => {
    const {
      readOnly,
      annotationVisibility = {},
      sequenceData: { sequence = "" } = {},
      sequenceData,
      minimumOrfSize
    } = editorState;
    return {
      readOnly,
      annotationVisibility,
      orfs: selectors.orfsSelector(editorState),
      sequenceLength: sequence.length,
      sequenceData,
      minimumOrfSize
    };
  }),
  withSelectedEntities("orfProperties")
)(OrfProperties);
