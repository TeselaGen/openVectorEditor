import React from "react";
import { DataTable, withSelectedEntities } from "teselagen-react-components";
import { map } from "lodash";
import { Button } from "@blueprintjs/core";
import { getRangeLength, convertRangeTo1Based } from "ve-range-utils";

class OrfProperties extends React.Component {
  render() {
    const { sequenceData = {} } = this.props;
    const { orfs } = sequenceData;
    const orfsToUse = map(orfs, orf => {
      return {
        ...orf,
        frame: orf.frame + 1,
        ...(orf.strand === undefined && {
          strand: orf.forward ? 1 : -1
        }),
        size: getRangeLength(orf, sequenceData.sequence.length)
      };
    });
    return (
      <div>
        <DataTable
          noPadding
          withSearch={false}
          maxHeight={400}
          formName={"orfProperties"}
          noRouter
          compact
          isInfinite
          schema={{
            fields: [
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
