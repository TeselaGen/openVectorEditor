import { compose } from "recompose";
import React from "react";

import withEditorInteractions from "../withEditorInteractions";
import { ReactSelectField, tgFormValues } from "teselagen-react-components";
import { reduxForm } from "redux-form";
import { flatMap, forEach, keyBy } from "lodash";
import SimpleCircularOrLinearView from "../SimpleCircularOrLinearView";
import {
  getReverseComplementSequenceString,
  getSequenceDataBetweenRange,
  tidyUpSequenceData,
  shiftAnnotationsByLen
} from "ve-sequence-utils";
import { getRangeLength, getSequenceWithinRange } from "ve-range-utils/lib";

function PCRTool(props) {
  const {
    sequenceData,
    dimensions: { width, height },
    forwardPrimer,
    reversePrimer,
    primerClicked
  } = props;
  const origSeqLen = sequenceData.sequence.length;
  forEach(sequenceData.primers, (p) => (p.originalId = p.id));
  const fPrimer = sequenceData.primers[forwardPrimer];
  const rPrimer = sequenceData.primers[reversePrimer];
  let seqBetween;
  if (fPrimer && rPrimer) {
    const r = {
      start: fPrimer.start,
      end: rPrimer.end
    };

    const newSeqData = getSequenceDataBetweenRange(sequenceData, r);

    if (rPrimer.bases) {
      // remove rPrimer length from end of seq
      const rPrimerLen = getRangeLength(rPrimer, origSeqLen);

      newSeqData.sequence = getSequenceWithinRange(
        { start: 0, end: newSeqData.sequence.length - rPrimerLen - 1 },
        newSeqData.sequence
      );
      // tack back in the rPrimer.bases
      newSeqData.sequence =
        newSeqData.sequence + getReverseComplementSequenceString(rPrimer.bases);
      const newRPrimer = keyBy(newSeqData.primers, "id")[reversePrimer];

      newRPrimer.end = newSeqData.sequence.length - 1;
    }
    if (fPrimer.bases) {
      const fPrimerLength = getRangeLength(fPrimer, origSeqLen);
      const newSeqLen1 = newSeqData.sequence.length;
      // remove fPrimer length from start of seq
      newSeqData.sequence = getSequenceWithinRange(
        { start: fPrimerLength, end: newSeqData.sequence.length },
        newSeqData.sequence
      );
      // add back in the fPrimer.bases
      newSeqData.sequence = fPrimer.bases + newSeqData.sequence;
      // shift the existing annotations by the difference in seqLen before and after that operation
      const newSeqLen2 = newSeqData.sequence.length;
      const diff = newSeqLen2 - newSeqLen1;
      shiftAnnotationsByLen({
        seqData: newSeqData,
        insertLength: diff,
        caretPosition: 0
      });
      const newFPrimer = keyBy(newSeqData.primers, "id")[forwardPrimer];
      newFPrimer.start = 0;
    }

    seqBetween = tidyUpSequenceData(newSeqData, {
      provideNewIdsForAnnotations: true
    });
    seqBetween.name = `PCR Product from ${sequenceData.name} `;
  }
  const getPrimers = (opts) => {
    return flatMap(
      sequenceData.primers,
      ({ name, id, forward, start, end }) => {
        if (opts.forward && !forward) return [];
        if (!opts.forward && forward) return [];
        return {
          label: (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>{name}</div>
              <div
                style={{
                  marginLeft: 8,
                  fontStyle: "italic",
                  color: "grey",
                  fontSize: 11
                }}
              >
                ({start + 1} - {end + 1})
              </div>
            </div>
          ),
          value: id
        };
      }
    );
  };
  const forwardPrimers = getPrimers({ forward: true });
  const reversePrimers = getPrimers({ forward: false });
  return (
    <div
      className="createPcrTool"
      style={{ padding: 10, overflowY: "auto", height }}
    >
      <ReactSelectField
        noResultsText="Create a new primer in the forward direction to use it in this tool"
        inlineLabel
        tooltipError
        options={forwardPrimers}
        defaultValue={forwardPrimers[0] ? forwardPrimers[0].value : undefined}
        name="forwardPrimer"
        label="Forward Primer:"
      />
      <ReactSelectField
        noResultsText="Create a new primer in the reverse direction to use it in this tool"
        inlineLabel
        tooltipError
        options={reversePrimers}
        defaultValue={reversePrimers[0] ? reversePrimers[0].value : undefined}
        name="reversePrimer"
        label="Reverse Primer:"
      />
      <div style={{ fontWeight: "600", fontSize: 13 }}>Output Product:</div>
      {seqBetween ? (
        <>
          <SimpleCircularOrLinearView
            noWarnings
            withZoomLinearView
            withZoomCircularView
            withChoosePreviewType
            withDownload
            smallSlider
            withCaretEnabled
            width={width - 50}
            height={Math.max(height - 250, 400)}
            sequenceData={seqBetween}
            primerClicked={(args) => {
              primerClicked({
                ...args,
                annotation: sequenceData.primers[args.annotation.originalId]
              });
            }}
          ></SimpleCircularOrLinearView>
        </>
      ) : (
        <div style={{ marginTop: 5, fontStyle: "italic", color: "grey" }}>
          Please choose a forward and reverse primer to see the resulting PCR
          sequence
        </div>
      )}
    </div>
  );
}

export default compose(
  withEditorInteractions,
  reduxForm({ form: "PCRTool" }),
  tgFormValues("forwardPrimer", "reversePrimer")
)(PCRTool);
