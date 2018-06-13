import React from "react";
import { DataTable } from "teselagen-react-components";
import { Tabs, Tab, Button, InputGroup, Intent } from "@blueprintjs/core";

export class Mismatches extends React.Component {
    // state = { selectedTab: "virtualDigest" };
    render() {
        const schema = {
            fields: [
              { path: "Base Pair Position" }
            ]
          };

        // const schema = {
        // fields: [
        //     { path: "name" },
        //     // {
        //     // path: "id",
        //     // type: "action",
        //     // render: () => {
        //     //     return <Button className={"pt-minimal pt-icon-circle"} />;
        //     // }
        //     // }
        // ]
        // };
        
        // const entities = [
        // {
        //     name: "Thomas",
        //     id: "1"
        // },
        // {
        //     name: "Taoh",
        //     id: "2"
        // },
        // {
        //     name: "Chris",
        //     id: "3"
        // },
        // {
        //     name: "Sam",
        //     id: "4"
        // },
        // {
        //     name: "Adam",
        //     id: "5"
        // }
        // ];

        const { alignmentId, alignments } = this.props;
        // console.log('this.props in mismatches:',this.props)
        // console.log('alignmentId in mismatches:',alignmentId)
        console.log('alignments in mismatches:',alignments)
        // console.log('alignments[alignmentId]:',alignments[alignmentId])
        let mismatchesList = [];
        // need a mismatches list for each alignment track? 
        // skip first sequence/ref seq, since there will be no mismatches
        for (let alignmentTrackI = 1; alignmentTrackI < alignments[alignmentId].alignmentTracks.length; alignmentTrackI++) {
            let alignmentTrackName = alignments[alignmentId].alignmentTracks[alignmentTrackI].alignmentData.name
            let editedAlignmentTrackName = alignmentTrackName.slice(alignmentTrackName.indexOf("_") + 1)
            mismatchesList.push("Mismatches in " + editedAlignmentTrackName)
            for (let mismatchesI = 0; mismatchesI < alignments[alignmentId].alignmentTracks[alignmentTrackI].mismatches.length; mismatchesI++) {
                let mismatchEnd = alignments[alignmentId].alignmentTracks[alignmentTrackI].mismatches[mismatchesI].end;
                let mismatchStart = alignments[alignmentId].alignmentTracks[alignmentTrackI].mismatches[mismatchesI].start;
                let mismatchDifference = mismatchEnd - mismatchStart
                // display mismatch bp pos as 1-based (currently stored as 0-based)
                if (mismatchDifference === 0) {
                    mismatchesList.push({ "Base Pair Position": mismatchStart + 1 })
                    // mismatchesList.push(mismatchStart + 1)
                } else {
                    for (let innerI = 0; innerI <= mismatchDifference; innerI++) {
                        // console.log('mismatchStart, mismatchEnd, mismatchDifference, innerI:',mismatchStart, mismatchEnd, mismatchDifference, innerI)
                        mismatchesList.push({ "Base Pair Position": mismatchStart + innerI + 1 })
                        // mismatchesList.push(mismatchStart + innerI + 1)
                    }
                }
            }
        }
        console.log('mismatchesList:',mismatchesList)
        return (
            <div>
            <div
              style={{
                margin: 10,
                display: "flex",
                justifyContent: "space-around"
              }}
            >
              <div style={{ width: 300 }}>
                <h3>Mismatches: </h3>
                <DataTable
                  //defaults={{order: ["numberOfCuts"]}}
                  maxHeight={300}
                //   onRowSelect={this.onRowSelect}
                //   formName={"cutLocations"}
                  isSingleSelect
                  compact
                  noRouter
                  noHeader
                  isSimple
                  isInfinite
                  withSearch={false}
                  withFilter={false}
                  formName={"mismatchesTable"}
                  schema={schema}
                //   entities={entities}
                  entities={mismatchesList}
                />
              </div>
            </div>
          </div>
        );
  }
}

export default Mismatches;

//Component Development Overseen by Patrick Michelson
