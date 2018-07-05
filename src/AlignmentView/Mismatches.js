import React from "react";
import { DataTable, withSelectedEntities } from "teselagen-react-components";

class Mismatches extends React.Component {
    UNSAFE_componentWillMount() {
        const { alignmentData, mismatches } = this.props;
        // const { alignmentId, alignments } = this.props;
        console.log('this.props:',this.props)
        const mismatchList = this.getMismatchList(alignmentData, mismatches);
        // const mismatchListAll = this.getMismatchList(alignmentId, alignments);
        const schema = {
            fields: [
                { path: "mismatches", type: "number" }
            ]
        };
        this.setState({ mismatchList, schema });
    }

    // UNSAFE_componentWillReceiveProps(newProps) {
    //     if (
    //       newProps.charWidth !== this.props.charWidth ||
    //       newProps.row.start !== this.props.row.start ||
    //       newProps.row.end !== this.props.row.end
    //     ) {
    //       const charWidth = newProps.charWidth;
    //     //   const { scalePct } = this.state;
    //     //   this.updatePeakDrawing(scalePct, charWidth);
    //     }
    //   }

    // handleMismatchClick = e => {
    //     const { getGaps, charWidth, alignments } = this.props;
    //     const alignmentData = alignments.alignmentTracks
    //     const gapsBeforeSequence = getGaps(0).gapsBefore;
    //     const posOfSeqRead = gapsBeforeSequence * charWidth;
    // };

    // onRowSelect = ([record]) => {
    //     // console.log('record:',record)
    //     if (!record) return;
    //     const { dispatch, editorName } = this.props;
    //     dispatch({
    //       type: "SELECTION_LAYER_UPDATE",
    //       payload: record,
    //       meta: {
    //         editorName
    //       }
    //     });
    //   };

    getGapMap = (sequence) => {
        const gapMap = [0]; //a map of position to how many gaps come before that position [0,0,0,5,5,5,5,17,17,17, ]
        sequence.split("").forEach(char => {
        if (char === "-") {
            gapMap[Math.max(0, gapMap.length - 1)] =
            (gapMap[Math.max(0, gapMap.length - 1)] || 0) + 1;
        } else {
            gapMap.push(gapMap[gapMap.length - 1] || 0);
        }
        });
        return gapMap;
    }

    getMismatchList = (alignmentData, mismatches) => {
    // getMismatchList = (alignmentId, alignments) => {
        // let mismatchListAll = [];
        // console.log('alignments, in mismatches:',alignments)
        // console.log('alignmentId:',alignmentId)
        // skip first sequence/ref seq, since there will be no mismatches
        // for (let trackI = 1; trackI < alignments[alignmentId].alignmentTracks.length; trackI++) {
            let mismatchList = [];
            let trackName = alignmentData.name
            let editedTrackName = trackName.slice(trackName.indexOf("_") + 1)
            // mismatchList.push({ "name": editedTrackName })
            // for (let mismatchI = 0; mismatchI < alignments[alignmentId].alignmentTracks[trackI].mismatches.length; mismatchI++) {
            //     let mismatchEnd = alignments[alignmentId].alignmentTracks[trackI].mismatches[mismatchI].end;
            //     let mismatchStart = alignments[alignmentId].alignmentTracks[trackI].mismatches[mismatchI].start;
            //     let mismatchDifference = mismatchEnd - mismatchStart
            //     // display 'position' as 1-based but store 'start' & 'end' as 0-based
            //     if (mismatchDifference === 0) {
            //         mismatchList.push({ "position": mismatchStart + 1, "start": mismatchStart, "end": mismatchStart })
            //     } else {
            //         for (let innerI = 0; innerI <= mismatchDifference; innerI++) {
            //             mismatchList.push({ "position": mismatchStart + innerI + 1, "start": mismatchStart + innerI, "end": mismatchStart + innerI })
            //         }
            //     }
            // }
            // const alignmentData = alignments[alignmentId].alignmentTracks[trackI].alignmentData
            // console.log('alignmentData:',alignmentData)
            let getGaps = () => ({
                gapsBefore: 0,
                gapsInside: 0
            });
            const gapMap = this.getGapMap(alignmentData.sequence);
            getGaps = rangeOrCaretPosition => {
                if (typeof rangeOrCaretPosition !== "object") {
                return {
                    gapsBefore:
                    gapMap[Math.min(rangeOrCaretPosition, gapMap.length - 1)]
                };
                }
                const { start, end } = rangeOrCaretPosition;
                const toReturn = {
                gapsBefore: gapMap[start],
                gapsInside:
                    gapMap[Math.min(end, gapMap.length - 1)] -
                    gapMap[Math.min(start, gapMap.length - 1)]
                };
                return toReturn;
            };        
            
            const gapsBeforeSequence = getGaps(0).gapsBefore;
            // console.log('gapsBeforeSequence:',gapsBeforeSequence)
            for (let mismatchI = 0; mismatchI < mismatches.length; mismatchI++) {
                let mismatchEnd = mismatches[mismatchI].end;
                let mismatchStart = mismatches[mismatchI].start;
                let mismatchDifference = mismatchEnd - mismatchStart
                // display 'position' as 1-based but store 'start' & 'end' as 0-based
                if (mismatchDifference === 0) {
                    mismatchList.push({ "mismatches": mismatchStart + 1 - gapsBeforeSequence, "start": mismatchStart - gapsBeforeSequence, "end": mismatchStart - gapsBeforeSequence })
                } else {
                    for (let innerI = 0; innerI <= mismatchDifference; innerI++) {
                        mismatchList.push({ "mismatches": mismatchStart + innerI + 1 - gapsBeforeSequence, "start": mismatchStart + innerI - gapsBeforeSequence, "end": mismatchStart + innerI - gapsBeforeSequence })
                    }
                }
            }
            // mismatchListAll.push(mismatchList)
        // }
        // console.log('mismatchListAll:',mismatchListAll)
        return mismatchList;
    }

    render() {
        const { mismatchList, schema } = this.state;
        // console.log('mismatchList:',mismatchList)
        let tableOfMismatches;
        if (mismatchList.length === 0) {
            tableOfMismatches = null;
        } else {
            tableOfMismatches = <DataTable
            maxHeight={168}
            formName={"mismatchesTable"}
            isSimple
            compact
            noRouter
            // onRowSelect={this.handleMismatchClick}
            schema={schema}
            entities={mismatchList}
        />
        }

        return (
            <div style={{ maxHeight: 180.8, overflowY: "scroll" }}>
                {/* <div style={{ fontSize: 15, textAlign: "center" }}><b>Positions of Mismatches</b></div> */}
                <div style={{
                    // margin: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>

                            <div 
                                style={{ width: 100, margin: 4 }}
                            >
                                {/* <div style={{ 
                                    paddingBottom: 10, 
                                    textOverflow: "ellipsis",
                                    overflowY: "auto",
                                    whiteSpace: "nowrap",
                                    fontSize: 13,
                                    textAlign: "center"
                                }}>
                                    <b>{mismatchList[0].name}</b>
                                </div> */}
                                {tableOfMismatches}
                            </div>

                </div>
            </div>
        );
    }
}

export default withSelectedEntities("mismatchesTable")(
    Mismatches
);