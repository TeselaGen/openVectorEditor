import React from "react";
import { Button } from "@blueprintjs/core";
// import { InfoHelper } from "teselagen-react-components";

class Chromatogram extends React.Component {
  constructor(props) {
    super(props);
    const scalePct = 0.05;
    this.state = { scalePct };
  }
  componentDidMount() {
    const { charWidth } = this.props;
    const { scalePct } = this.state;
    this.updatePeakDrawing(scalePct, charWidth);
  }
  shouldComponentUpdate(newProps) {
    const { props } = this;
    if (
      [
        "alignmentData",
        "chromatogramData",
        "charWidth",
        "row.start",
        "row.end"
      ].some(key => props[key] !== newProps[key])
    ) {
      const charWidth = newProps.charWidth;
      const { scalePct } = this.state;
      this.updatePeakDrawing(scalePct, charWidth);
      return true;
    }
    return false;
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
    const { getGaps, charWidth } = this.props;
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
          minimal
          className="scaleChromatogramButtonUp"
          icon="caret-up"
          onClick={this.scaleChromatogramYPeaksHigher}
          style={{
            zIndex: 10,
            position: "sticky",
            // left: 275
            left: 145
          }}
        />
        <Button
          minimal
          className="scaleChromatogramButtonDown"
          icon="caret-down"
          onClick={this.scaleChromatogramYPeaksLower}
          style={{
            zIndex: 10,
            position: "sticky",
            // left: 305
            left: 175
          }}
        />
        <br />
        <div
          className="chromatogram-trace"
          style={{
            zIndex: -1,
            position: "relative",
            left: posOfSeqRead,
            display: "inline-block"
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
  const seqLengthWithGaps =
    endBp - startBp + 1 + getGaps({ start: startBp, end: endBp }).gapsInside;
  const maxWidth = seqLengthWithGaps * charWidth;
  // const maxWidth = endBpIncludingGaps * charWidth;
  peakCanvas.width = maxWidth;
  // ctx.fillStyle = "white";
  // ctx.fillRect(0, 0, peakCanvas.width, peakCanvas.height);
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
    for (let baseIndex = startBp; baseIndex <= endBp; baseIndex++) {
      // each base's beginning and end of its peak
      // grab the start and end (43, 53) , (53, 70) ...
      // looping through each base's peak
      const startBasePos = traceData.basePos[baseIndex] - 5;
      let endBasePos;
      if (baseIndex === endBp) {
        // last bp does not have a 'basePos[baseIndex + 1]' to define endBasePos...so use the difference in endBasePos - startBasePos of previous bp
        const previousBpStartEndDifference =
          traceData.basePos[baseIndex - 1] - traceData.basePos[baseIndex - 2];
        endBasePos = startBasePos + previousBpStartEndDifference;
      } else {
        endBasePos = traceData.basePos[baseIndex + 1] - 5;
      }

      for (
        let innerIndex = startBasePos;
        innerIndex < endBasePos;
        innerIndex++
      ) {
        const gapsBeforeSequence = getGaps(0).gapsBefore;
        const gapsBeforeMinusBeginningGaps =
          getGaps(baseIndex).gapsBefore - gapsBeforeSequence;
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
            (baseIndex +
              getGaps(baseIndex - 1).gapsBefore -
              gapsBeforeSequence) *
            charWidth;
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
      const gapsBeforeMinusBeginningGaps =
        getGaps(count).gapsBefore - gapsBeforeSequence;
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

// componentDidMount() {
//   const painter = new drawTrace(ab1Parsed)
//   painter.paintCanvas()
// }
