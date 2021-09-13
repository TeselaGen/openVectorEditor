// import uniqid from "shortid";
// import Ladder from "./Ladder";
// import { compose, withProps } from "recompose";
// import { normalizePositionByRangeLength, getRangeLength } from "ve-range-utils";
// import selectionLayer from "../redux/selectionLayer";
import { Button, InputGroup } from "@blueprintjs/core";
import React, { useState } from "react";
import { compose } from "recompose";
import { DataTable, wrapDialog } from "teselagen-react-components";
import { getRangeLength, normalizeRange } from "ve-range-utils";
import getSequenceWithinRange from "ve-range-utils/lib/getSequenceWithinRange";
import { showDialog } from "../GlobalDialogUtils";
import { getSelectionMessage } from "../utils/editorUtils";

import withEditorProps, { connectToEditor } from "../withEditorProps";
import primerTmCalc from "./primerTmCalc";

// import withEditorInteractions from "../withEditorInteractions";
// import { userDefinedHandlersAndOpts } from "../Editor/userDefinedHandlersAndOpts";
const schema = ["amplifiedRegion", "productSize"];
export default compose(withEditorProps)(function PrimerTool(props) {
  const [bps1, setBps1] = useState("");
  const [bps2, setBps2] = useState("");
  const { selectionLayer, sequenceData } = props;
  const seq = sequenceData.sequence;
  const seqLen = seq.length;
  console.log(`selectionLayer:`, selectionLayer);
  // if (getRangeLength)
  console.log(`primerTmCalc(gtagatagagaga):`, primerTmCalc("gtagatagagaga"));
  return (
    <div style={{ margin: 10 }}>
      <Button
        disabled={getRangeLength(selectionLayer, seqLen) < 25}
        onClick={() => {
          const bps1ToUse = getSequenceWithinRange(
            normalizeRange(
              { start: selectionLayer.start, end: selectionLayer.start + 10 },
              seqLen
            ),
            seq
          );
          const bps2ToUse = getSequenceWithinRange(
            normalizeRange(
              { start: selectionLayer.end - 10, end: selectionLayer.end },
              seqLen
            ),
            seq
          );
          setBps1(bps1ToUse);
          setBps2(bps2ToUse);
          //tnr: eventually this should pop up an intermediary dialog asking for the desired tm
          // showDialog({
          //   dialogType
          // })
        }}
        intent="primary"
      >
        Generate Primers for Selection
      </Button>{" "}
      <span style={{ marginLeft: 20, fontSize: 11, fontStyle: "italic" }}>
        {getSelectionMessage({ selectionLayer })}
      </span>
      <br></br>
      <br></br>
      <DataTable isSimple entities={[]} schema={schema}></DataTable>
      <PrimerDiv number={1} tm={60} bps={bps1} setBps={setBps1}></PrimerDiv>
      <PrimerDiv number={2} tm={60} bps={bps2} setBps={setBps2}></PrimerDiv>
<br></br>
<br></br>
      <Button intent="primary">
        Finalize Primers
      </Button>
    </div>
  );
  // return <div style={{ margin: 10 }}>Please select a region of 20 or more bps</div>;
});

function PrimerDiv({ number, tm, bps, setBps }) {
  return (
    <div style={{ marginTop: 10 }}>
      Primer {number} &nbsp; Tm: {tm}
      <div
        className={"tgPrimerInput"}
        style={{
          letterSpacing: "2px;",
          fontFamily:
            "Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;"
        }}
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        onChange={setBps}
        contentEditable
      >
        {bps}
      </div>
    </div>
  );
}

function getBindingSitesForSequence({ sequence }) {}

export const CreatePrimersForRegionDialog = compose(
  wrapDialog({ title: "Create Primers for Region" })
)(() => {});
