import React from "react";
import { DataTable, withSelectedEntities } from "teselagen-react-components";
import { map } from "lodash";
// import { Button } from "@blueprintjs/core";
import { getRangeLength, convertRangeTo1Based } from "ve-range-utils";
import orfFrameToColorMap from "../../constants/orfFrameToColorMap";

class OrfProperties extends React.Component {
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
    const { sequenceData = {} } = this.props;
    const { orfs } = sequenceData;
    const orfsToUse = map(orfs, orf => {
      return {
        ...orf,
        color: orfFrameToColorMap[orf.frame],
        frame: orf.frame + 1,
        ...(orf.strand === undefined && {
          strand: orf.forward ? 1 : -1
        }),
        size: getRangeLength(orf, sequenceData.sequence.length),
        sizeAa: Math.floor(
          getRangeLength(orf, sequenceData.sequence.length) / 3
        )
      };
    });
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataTable
          noPadding
          onRowSelect={this.onRowSelect}
          withSearch={false}
          maxHeight={400}
          formName={"orfProperties"}
          noRouter
          compact
          isInfinite
          schema={{
            fields: [
              {
                path: "color",
                type: "string",
                render: color => {
                  console.log("color:", color);
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
      </div>
    );
  }
}

export default withSelectedEntities("orfProperties")(OrfProperties);
