import React from "react";
import { Button, Intent } from "@blueprintjs/core";
import { InfoHelper } from "teselagen-react-components";
import Draggable from "react-draggable";

class Chromatogram extends React.Component {
  state = { scalePct: 0.05 };

  componentDidMount() {
    const { charWidth } = this.props;
    const { scalePct } = this.state;
    this.updatePeakDrawing(scalePct, charWidth);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    if (
      newProps.chromatogramData !== this.props.chromatogramData ||
      newProps.charWidth !== this.props.charWidth ||
      newProps.row.start !== this.props.row.start ||
      newProps.row.end !== this.props.row.end
    ) {
      const charWidth = newProps.charWidth;
      const { scalePct } = this.state;
      this.updatePeakDrawing(scalePct, charWidth);
    }
  }

  updatePeakDrawing = (scalePct, charWidth) => {
    const { chromatogramData, row, getGaps } = this.props;
    const painter = new drawTrace({
      peakCanvas: this.canvasRef,
      traceData: chromatogramData,
      charWidth: charWidth,
      startBp: row.start,
      endBp: row.end,
      getGaps,
      scalePct: scalePct
    });
    painter.paintCanvas();
  };

  scaleChromatogramYPeaksHigher = e => {
    e.stopPropagation();
    const { charWidth } = this.props;
    const { scalePct } = this.state;
    const peakCanvas = this.canvasRef;
    const ctx = peakCanvas.getContext("2d");
    ctx.clearRect(0, 0, peakCanvas.width, peakCanvas.height);
    const newScalePct = scalePct + 0.01;
    this.updatePeakDrawing(newScalePct, charWidth);
    this.setState({ scalePct: newScalePct });
  };
  scaleChromatogramYPeaksLower = e => {
    e.stopPropagation();
    const { charWidth } = this.props;
    const { scalePct } = this.state;
    const peakCanvas = this.canvasRef;
    const ctx = peakCanvas.getContext("2d");
    ctx.clearRect(0, 0, peakCanvas.width, peakCanvas.height);
    const newScalePct = scalePct - 0.01;
    this.updatePeakDrawing(newScalePct, charWidth);
    this.setState({ scalePct: newScalePct });
  };

  render() {
    const { chromatogramData, getGaps, charWidth } = this.props;
    const { suggestedTrimStart, suggestedTrimEnd } = mottTrim(
      chromatogramData.qualNums
    );
    const gapsBeforeSequence = getGaps(0).gapsBefore;
    const posOfSeqRead = gapsBeforeSequence * charWidth;

    return (
      <div
        className="chromatogram"
        style={{
          position: "relative"
        }}
      >
        <Button
          className="pt-minimal scaleChromatogramButtonUp"
          icon="caret-up"
          onClick={this.scaleChromatogramYPeaksHigher}
          style={{
            zIndex: 10,
            position: "sticky",
            left: 145
          }}
        />
        <Button
          className="pt-minimal scaleChromatogramButtonDown"
          icon="caret-down"
          onClick={this.scaleChromatogramYPeaksLower}
          style={{
            zIndex: 10,
            position: "sticky",
            left: 175
          }}
        />

      {/* <div
        className="chromatogram-trim"
        style={{ zIndex: 100, position: "relative" }}
      >
        <Draggable
          bounds={"parent"}
          defaultPosition={{ x: suggestedTrimStart * charWidth, y: 0 }}
          grid={[charWidth, 0]}
          axis={"x"}
          // onDrag={this.handleDrag}
          // {...dragHandlers}
          // onStop={this.getPos}
        >
          <div
            className="startBar"
            style={{
              height: "100%",
              border: "none",
              position: "absolute",
              width: 3,
              background: "black"
            }}
          />
        </Draggable>
      </div> */}

        <br/>
        <div
          className="chromatogram-trace"
          style={{
            zIndex: -1,
            position: "relative",
            left: posOfSeqRead,
            display: 'inline-block'
          }}
        >
          <canvas
            ref={n => {
              if (n) this.canvasRef = n;
            }}
            height="100"
          />
        </div>
      </div>
    );
  }
}

export default Chromatogram;

function drawTrace({
  traceData,
  charWidth,
  startBp,
  peakCanvas,
  endBp,
  getGaps,
  scalePct
}) {

  const colors = {
    adenine: "green",
    thymine: "red",
    guanine: "black",
    cytosine: "blue",
    other: "purple"
  };
  const ctx = peakCanvas.getContext("2d");

  const formattedPeaks = { a: [], t: [], g: [], c: [] };
  const bottomBuffer = 0;
  const maxHeight = peakCanvas.height;
  // const endBpIncludingGaps =
  //   endBp +
  //   1 +
  //   getGaps(0).gapsBefore +
  //   getGaps({ start: startBp, end: endBp }).gapsInside;
  const seqLengthWithGaps = endBp - startBp + 1 + getGaps({ start: startBp, end: endBp }).gapsInside;
  const maxWidth = seqLengthWithGaps * charWidth;
  // const maxWidth = endBpIncludingGaps * charWidth;
  peakCanvas.width = maxWidth;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, peakCanvas.width, peakCanvas.height);
  const scaledHeight = maxHeight - bottomBuffer;
  // let scalePct = 0;

  // this.findTallest = function() {
  //   const aMax = Math.max(...traceData.aTrace);
  //   const tMax = Math.max(...traceData.tTrace);
  //   const gMax = Math.max(...traceData.gTrace);
  //   const cMax = Math.max(...traceData.cTrace);
  //   scalePct = scaledHeight / Math.max(aMax, tMax, gMax, cMax);
  // };

  this.scalePeaks = function(traceIn) {
    const newPeaks = [];
    for (let count = 0; count < traceIn.length; count++) {
      newPeaks[count] = scalePct * traceIn[count];
    }
    return newPeaks;
  };

  this.preparePeaks = function() {
    // this.findTallest();
    formattedPeaks.a = this.scalePeaks(traceData.aTrace);
    formattedPeaks.t = this.scalePeaks(traceData.tTrace);
    formattedPeaks.g = this.scalePeaks(traceData.gTrace);
    formattedPeaks.c = this.scalePeaks(traceData.cTrace);
  };

  this.drawPeaks = function(trace, lineColor) {
    ctx.beginPath();
    //loop through base positions [ 43, 53, 70, 77, ...]
    // looping through the entire sequence length
    for (let baseIndex = startBp; baseIndex < endBp; baseIndex++) {
      // each base's beginning and end of its peak
      const startBasePos = traceData.basePos[baseIndex] - 5;
      const endBasePos = traceData.basePos[baseIndex + 1] - 5;
      // grab the start and end (43, 53) , (53, 70) ...
      // looping through each base's peak

      for (
        let innerIndex = startBasePos;
        innerIndex < endBasePos;
        innerIndex++
      ) {
        const gapsBeforeSequence = getGaps(0).gapsBefore;
        const gapsBeforeMinusBeginningGaps = getGaps(baseIndex).gapsBefore - gapsBeforeSequence;
        // innerIndex = 43, 44, 45, ... 52
        // shift x-position of the beginning of the base's peak if there are gaps before the base
        const scalingFactor = charWidth / (endBasePos - startBasePos);
        let startXPosition =
        (baseIndex + gapsBeforeMinusBeginningGaps) * charWidth;

        if (
          getGaps(baseIndex - 1).gapsBefore !== getGaps(baseIndex).gapsBefore
        ) {
          if (innerIndex === startBasePos) {
            ctx.moveTo(
              startXPosition + scalingFactor * (innerIndex - startBasePos),
              scaledHeight - trace[innerIndex]
            );
          }
          ctx.lineTo(
            startXPosition + scalingFactor * (innerIndex - startBasePos),
            scaledHeight - trace[innerIndex]
          );
        } else {
          startXPosition =
            (baseIndex + getGaps(baseIndex - 1).gapsBefore - gapsBeforeSequence) * charWidth;
          ctx.lineTo(
            startXPosition + scalingFactor * (innerIndex - startBasePos),
            scaledHeight - trace[innerIndex]
          );
        }
      }
    }
    ctx.strokeStyle = lineColor;
    ctx.stroke();
  };

  //   this.drawBases = function () {
  //       //ctx.font = "24px serif";
  //       for (let count = 0; count < traceData.baseCalls.length; count++) {
  //           const baseCall = traceData.baseCalls[count];
  //           switch(baseCall) {
  //               case "A":
  //                   ctx.fillStyle = colors.adenine;
  //                   break;
  //               case "T":
  //                   ctx.fillStyle = colors.thymine;
  //                   break;
  //               case "G":
  //                   ctx.fillStyle = colors.guanine;
  //                   break;
  //               case "C":
  //                   ctx.fillStyle = colors.cytosine;
  //                   break;
  //               default:
  //                   ctx.fillStyle = colors.other;
  //           }
  //           let positionToUse = count * charWidth

  //           ctx.fillText(baseCall, positionToUse, maxHeight - baseBuffer);
  //       }
  //   }

  this.drawQualityScoreHistogram = function() {
    const qualMax = Math.max(...traceData.qualNums);
    const scalePctQual = scaledHeight / qualMax;
    const gapsBeforeSequence = getGaps(0).gapsBefore;
    for (let count = 0; count < traceData.qualNums.length; count++) {
      const gapsBeforeMinusBeginningGaps = getGaps(count).gapsBefore - gapsBeforeSequence;
      ctx.rect(
        (count + gapsBeforeMinusBeginningGaps) * charWidth,
        scaledHeight - traceData.qualNums[count] * scalePctQual,
        charWidth,
        traceData.qualNums[count] * scalePctQual
      );
    }
    ctx.fillStyle = "#f4f1fa";
    ctx.fill();
    ctx.strokeStyle = "#e9e3f4";
    ctx.stroke();
  };

  this.paintCanvas = function() {
    this.drawQualityScoreHistogram();
    this.preparePeaks();
    this.drawPeaks(formattedPeaks.a, colors.adenine);
    this.drawPeaks(formattedPeaks.t, colors.thymine);
    this.drawPeaks(formattedPeaks.g, colors.guanine);
    this.drawPeaks(formattedPeaks.c, colors.cytosine);
    // this.drawBases();
    ctx.closePath();
  };
}

function mottTrim(qualNums) {
  let startPos = 0;
  let endPos = 0;
  let tempStart = 0;
  // let tempEnd;
  let score = 0;
  const cutoff = 0.05;
  for (let count = 0; count < qualNums.length; count++) {
    score = score + cutoff - Math.pow(10, qualNums[count] / -10);
    if (score < 0) {
      tempStart = count;
    }
    if (count - tempStart > endPos - startPos) {
      startPos = tempStart;
      endPos = count;
    }
  }
  // const trimmed = baseCalls.slice(startPos, endPos + 1);
  const suggestedTrimStart = startPos;
  const suggestedTrimEnd = endPos;
  return {
    suggestedTrimStart,
    suggestedTrimEnd
  };
}

// componentDidMount() {
//   const painter = new drawTrace(ab1Parsed)
//   painter.paintCanvas()
// }
