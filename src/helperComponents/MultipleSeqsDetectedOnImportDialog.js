import { DialogFooter, wrapDialog } from "teselagen-react-components";

import { Button, Callout, Card } from "@blueprintjs/core";

import { hideDialog } from "../GlobalDialogUtils";
import SimpleCircularOrLinearView from "../SimpleCircularOrLinearView";
import React, { useState } from "react";
import { tidyUpSequenceData } from "ve-sequence-utils";

export const MultipleSeqsDetectedOnImportDialog = wrapDialog({
  title: "Multiple Sequences Detected"
  // style: { height: 600, width: 800 }
})(({ results, finishDisplayingSeq }) => {
  const [_selectedSeqData, setSelectedSeqData] = useState(
    results[0].parsedSequence
  );
  const selectedSeqData = tidyUpSequenceData(_selectedSeqData);
  return (
    <div>
      <div className="bp3-dialog-body">
        <Callout intent="primary">
          Multiple sequences were detected in the input file. Please choose one
          to continue
        </Callout>
        <br></br>
        <div style={{ display: "flex" }}>
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {results.map((res, i) => {
              const { parsedSequence } = res;
              if (!parsedSequence) return null;
              const { name } = parsedSequence;
              return (
                <div key={i}>
                  <Button
                    active={parsedSequence === selectedSeqData}
                    onClick={() => {
                      setSelectedSeqData(parsedSequence);
                    }}
                    minimal
                  >
                    {name}
                  </Button>
                </div>
              );
            })}
          </div>
          &nbsp;
          <Card elevation={1}>
            <SimpleCircularOrLinearView
              sequenceData={selectedSeqData || { sequence: "" }}
              // tabHeight={tabHeight}
              editorClassName="previewEditor"
              height={null}
              isProtein={selectedSeqData && selectedSeqData.isProtein}
              annotationLabelVisibility={{
                features: true,
                parts: true,
                cutsites: false,
                primers: true
              }}
            ></SimpleCircularOrLinearView>
          </Card>
        </div>
      </div>
      <DialogFooter
        text="Select"
        onClick={() => {
          finishDisplayingSeq(selectedSeqData);
          hideDialog();
        }}
      ></DialogFooter>
    </div>
  );
});
