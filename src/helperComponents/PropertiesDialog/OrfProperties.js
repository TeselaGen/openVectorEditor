import React from "react";
import {
  DataTable,
  withSelectedEntities,
  CmdCheckbox,
  CmdDiv
} from "teselagen-react-components";
import { map } from "lodash";
// import { Button } from "@blueprintjs/core";
import { getRangeLength } from "ve-range-utils";
import { getOrfColor } from "../../constants/orfFrameToColorMap";
import { compose } from "recompose";

import getCommands from "../../commands";
import { sizeSchema } from "./utils";
import { observer } from "mobx-react";

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
    const { ed } = this.props;
    const { orfs, sequenceLength, annotationVisibility } = ed;
    const orfsToUse = map(orfs, (orf) => {
      return {
        ...orf,
        color: getOrfColor(orf),
        frame: orf.frame + 1,
        ...(orf.strand === undefined && {
          strand: orf.forward ? 1 : -1
        }),
        size: getRangeLength(orf, sequenceLength),
        sizeAa: Math.floor(getRangeLength(orf, sequenceLength) / 3 - 1)
      };
    });
    return (
      <React.Fragment>
        <DataTable
          topLeftItems={
            <CmdCheckbox
              name="Show ORFs (Open Reading Frames)"
              cmd={this.commands.toggleOrfs}
            />
          }
          annotationVisibility={annotationVisibility} //we need to pass this in order to force the DT to rerender
          noPadding
          noFullscreenButton
          onRowSelect={this.onRowSelect}
          withSearch={false}
          formName="orfProperties"
          noRouter
          compact
          isInfinite
          schema={{
            fields: [
              {
                path: "color",
                type: "string",
                render: (color) => {
                  return (
                    <div style={{ height: 20, width: 20, background: color }} />
                  );
                }
              },
              {
                path: "sizeAa",
                displayName: "Size (aa)",
                type: "number"
              },
              sizeSchema,
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
  withSelectedEntities("orfProperties"),
  observer,
)(OrfProperties);
