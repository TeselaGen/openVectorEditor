import React from "react";
import { Button } from "@blueprintjs/core";
import { get } from "lodash-es";
// import { getClientX, getClientY } from "../../utils/editorUtils";
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
  updatePeakDrawing = () => {
    const { isRowView, chromatogramData, row, getGaps, charWidth } = this.props;
    const { scalePct } = this.state;
    if (!this.canvasRef) return;
    if (!this.oldProps) this.oldProps = {};
    const keys = [
      "alignmentData",
      "chromatogramData",
      "charWidth",
      "row.start",
      "row.end"
    ];
    let shouldContinue;
    if (this.oldProps.scalePct !== scalePct) {
      shouldContinue = true;
    }
    if (
      !this.oldProps ||
      keys.some((key) => this.oldProps[key] !== get(this.props, key))
    ) {
      shouldContinue = true;
    }
    keys.forEach((k) => {
      this.oldProps[k] = get(this.props, k);
    });
    this.oldProps.scalePct = scalePct;
    if (!shouldContinue) return;
    const painter = new drawTrace({
      isRowView,
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

  scaleChromatogramYPeaksHigher = (e) => {
    e.stopPropagation();
    const { scalePct } = this.state;
    const newScalePct = scalePct + 0.01;
    this.setState({ scalePct: newScalePct });
  };
  scaleChromatogramYPeaksLower = (e) => {
    e.stopPropagation();
    const { scalePct } = this.state;
    const newScalePct = scalePct - 0.01;
    this.setState({ scalePct: newScalePct });
  };

  render() {
    const { getGaps, charWidth } = this.props;
    const gapsBeforeSequence = getGaps(0).gapsBefore;
    const posOfSeqRead = gapsBeforeSequence * charWidth;
    const { scalePct } = this.state;
    this.updatePeakDrawing(scalePct, charWidth);

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
            left: 175
          }}
        />
        <br />

        <div
          className="chromatogram-trace"
          style={{
            zIndex: 1,
            position: "relative",
            left: posOfSeqRead,
            display: "inline-block"
          }}
          // tnr comment back in for start of tooltip work
          // onMouseEnter={() => {
          //   this.setState({ showTooltip: true });
          // }}
          // onMouseLeave={() => {
          //   this.setState({ showTooltip: false });
          // }}
          // onMouseMove={(e) => {
          //   const { row } = this.props;
          //   const boundingRowRect =
          //     this.chromatogramRef.getBoundingClientRect();
          //   let nearestCaretPos;
          //   if (
          //     getClientY(e) > boundingRowRect.top &&
          //     getClientY(e) < boundingRowRect.top + boundingRowRect.height
          //   ) {
          //     if (getClientX(e) - boundingRowRect.left < 0) {
          //       nearestCaretPos = row.start;
          //     } else {
          //       const clickXPositionRelativeToRowContainer =
          //         getClientX(e) - boundingRowRect.left;
          //       const numberOfBPsInFromRowStart = Math.floor(
          //         (clickXPositionRelativeToRowContainer + charWidth / 2) /
          //           charWidth
          //       );
          //       nearestCaretPos = numberOfBPsInFromRowStart + row.start;
          //       if (nearestCaretPos > row.end + 1) {
          //         nearestCaretPos = row.end + 1;
          //       }
          //     }
          //     this.setState({
          //       nearestCaretPos
          //     });
          //     if (this.tooltipRef) {
          //       this.tooltipRef.style.left =
          //         getClientX(e) - boundingRowRect.left + "px";
          //       this.tooltipRef.style.top =
          //         getClientY(e) - boundingRowRect.top + "px";
          //     }
          //     if (this.tooltipHolderRef) {
          //       this.tooltipHolderRef.reposition();
          //     }
          //   }
          // }}
          ref={(n) => {
            if (n) this.chromatogramRef = n;
          }}
        >
          {/* tnr comment back in for start of tooltip work {this.state.showTooltip && (
            <div
              style={{
                position: "absolute",
                height: 1,
                width: 1,
                background: "white",
                top: this.state.tooltipTop,
                left: this.state.tooltipLeft
              }}
              ref={(n) => {
                if (n) this.tooltipRef = n;
              }}
              className="tg-chromatogram-tooltip"
            >
              <Tooltip
                hoverOpenDelay={300}
                ref={(n) => {
                  if (n) this.tooltipHolderRef = n;
                }}
                isOpen={true}
                content={<div>{this.state.nearestCaretPos + 1}</div>}
              >
                <div></div>
              </Tooltip>
            </div>
          )} */}

          <canvas
            ref={(n) => {
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
  isRowView,
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

  this.scalePeaks = function (traceIn) {
    const newPeaks = [];
    for (let count = 0; count < traceIn.length; count++) {
      newPeaks[count] = scalePct * traceIn[count];
    }
    return newPeaks;
  };

  this.preparePeaks = function () {
    // this.findTallest();
    formattedPeaks.a = this.scalePeaks(traceData.aTrace);
    formattedPeaks.t = this.scalePeaks(traceData.tTrace);
    formattedPeaks.g = this.scalePeaks(traceData.gTrace);
    formattedPeaks.c = this.scalePeaks(traceData.cTrace);
  };

  this.drawPeaks = function (trace, lineColor) {
    ctx.beginPath();
    //loop through base positions [ 43, 53, 70, 77, ...]
    // looping through the entire sequence length
    for (let baseIndex = startBp; baseIndex <= endBp; baseIndex++) {
      // each base's beginning and end of its peak
      // grab the start and end (43, 53) , (53, 70) ...
      // looping through each base's peak
      const startBasePos = traceData.basePos[baseIndex] - startOffset;
      let endBasePos;
      if (baseIndex === endBp) {
        // last bp does not have a 'basePos[baseIndex + 1]' to define endBasePos...so use the difference in endBasePos - startBasePos of previous bp
        const previousBpStartEndDifference =
          traceData.basePos[baseIndex - 1] - traceData.basePos[baseIndex - 2];
        endBasePos = startBasePos + previousBpStartEndDifference;
      } else {
        endBasePos = traceData.basePos[baseIndex + 1] - startOffset;
      }
      // console.log(`endBasePos:`,endBasePos)
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
          if (isRowView) {
            startXPosition = (baseIndex - startBp) * charWidth;
          } else {
            startXPosition =
              (baseIndex +
                getGaps(baseIndex - 1).gapsBefore -
                gapsBeforeSequence) *
              charWidth;
          }
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
  this.drawQualityScoreHistogram = function () {
    if (!traceData.qualNums) return;
    const qualMax = Math.max(...traceData.qualNums);
    const scalePctQual = scaledHeight / qualMax;
    const gapsBeforeSequence = getGaps(0).gapsBefore;
    for (let baseIndex = startBp; baseIndex <= endBp; baseIndex++) {
      const gapsBeforeMinusBeginningGaps =
        getGaps(baseIndex).gapsBefore - gapsBeforeSequence;
      ctx.rect(
        (baseIndex - startBp + gapsBeforeMinusBeginningGaps) * charWidth,
        scaledHeight - traceData.qualNums[baseIndex] * scalePctQual,
        charWidth,
        traceData.qualNums[baseIndex] * scalePctQual
      );
    }
    ctx.fillStyle = "#f4f1fa";
    ctx.fill();
    ctx.strokeStyle = "#e9e3f4";
    ctx.stroke();
  };

  this.paintCanvas = function () {
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

const startOffset = 5;
// const startOffset = 0
