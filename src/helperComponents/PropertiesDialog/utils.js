import React from "react";
import { convertDnaCaretPositionOrRangeToAA } from "ve-sequence-utils";
import { convertRangeTo1Based } from "ve-range-utils";

export const sizeSchema = {
  path: "size",
  type: "number",
  render: (val, _record, i, props) => {
    const record = props.isProtein
      ? convertDnaCaretPositionOrRangeToAA(_record)
      : _record;
    const base1Range = convertRangeTo1Based(record);
    const hasJoinedLocations = record.locations && record.locations.length > 1;

    return (
      <span>
        {props.isProtein ? Math.floor(val / 3) : val}{" "}
        <span style={{ fontSize: 10 }}>
          {hasJoinedLocations ? (
            record.locations.map((loc, i) => {
              const base1Range = convertRangeTo1Based(loc);
              return (
                <span key={i}>
                  ({base1Range.start}-{base1Range.end})
                </span>
              );
            })
          ) : (
            <span>
              ({base1Range.start}-{base1Range.end})
            </span>
          )}
        </span>
      </span>
    );
  }
};
