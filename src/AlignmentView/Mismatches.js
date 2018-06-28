import React from "react";
import { DataTable } from "teselagen-react-components";

export class Mismatches extends React.Component {
    componentDidMount() {
        const { alignmentId, alignments } = this.props;
        const mismatchListAll = this.getMismatchList(alignmentId, alignments);
        const schema = {
            fields: [
                { path: "position" }
            ]
        };
        this.setState({ mismatchListAll, schema });
    }
    getMismatchList = (alignmentId, alignments) => {
        // const { alignmentId, alignments } = this.props;
        let mismatchListAll = [];
        // skip first sequence/ref seq, since there will be no mismatches
        for (let trackI = 1; trackI < alignments[alignmentId].alignmentTracks.length; trackI++) {
            let mismatchList = [];
            let trackName = alignments[alignmentId].alignmentTracks[trackI].alignmentData.name
            let editedTrackName = trackName.slice(trackName.indexOf("_") + 1)
            mismatchList.push({ "name": editedTrackName })
            for (let mismatchI = 0; mismatchI < alignments[alignmentId].alignmentTracks[trackI].mismatches.length; mismatchI++) {
                let mismatchEnd = alignments[alignmentId].alignmentTracks[trackI].mismatches[mismatchI].end;
                let mismatchStart = alignments[alignmentId].alignmentTracks[trackI].mismatches[mismatchI].start;
                let mismatchDifference = mismatchEnd - mismatchStart
                // display mismatch bp pos as 1-based (currently stored as 0-based)
                if (mismatchDifference === 0) {
                    mismatchList.push({ "position": mismatchStart + 1 })
                } else {
                    for (let innerI = 0; innerI <= mismatchDifference; innerI++) {
                        mismatchList.push({ "position": mismatchStart + innerI + 1 })
                    }
                }
            }
            mismatchListAll.push(mismatchList)
        }
        // console.log('mismatchListAll:',mismatchListAll)
        return mismatchListAll;
    }

    render() {
        const { mismatchListAll, schema } = this.state;
        return (
            <div style={{ paddingTop: 30 }}>
                <h6 style={{ textAlign: "center" }}>Base Pair Positions of Mismatches<br/>(Relative to reference sequence)</h6>
                <div style={{
                    margin: 10,
                    display: "flex",
                    justifyContent: "space-around"
                }}
                >
                    {mismatchListAll.map(function(mismatchList, index) {
                        // console.log('mismatchList:',mismatchList)
                        return (
                            <div 
                                style={{ width: 100, margin: 15 }}
                                key={index}
                            >
                                <div style={{ 
                                    paddingBottom: 10, 
                                    textOverflow: "ellipsis",
                                    overflowY: "auto",
                                    whiteSpace: "nowrap"
                                }}>
                                    {mismatchList[0].name}
                                </div>
                                <DataTable
                                    //   onRowSelect={this.onRowSelect}
                                    maxHeight={300}
                                    formName={"mismatchesTable" + index}
                                    compact
                                    noRouter
                                    noHeader
                                    isSimple
                                    isSingleSelect
                                    isInfinite
                                    withSearch={false}
                                    withFilter={false}
                                    schema={schema}
                                    entities={mismatchList.slice(1)}
                                />
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        );
    }
}

export default Mismatches;