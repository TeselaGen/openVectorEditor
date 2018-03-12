import React from "react";
import uuidv4 from "uuidv4";

class Chromatogram extends React.Component {
  componentDidMount() {
    this.updatePeakDrawing();
  }
  componentWillReceiveProps(newProps) {
    if (
      newProps.chromatogramData !== this.props.chromatogramData ||
      newProps.row.start !== this.props.row.start ||
      newProps.row.end !== this.props.row.end
    ) {
      this.updatePeakDrawing();
    }
  }
  updatePeakDrawing = () => {
    const { chromatogramData, charWidth, row, getGaps } = this.props;
    const painter = new drawTrace({
      peakCanvas: this.canvasRef,
      traceData: chromatogramData,
      charWidth,
      startBp: row.start + getGaps(0).gapsBefore,
      endBp: row.end,
      getGaps
    });
    painter.paintCanvas();
  };

  render() {
    // let { uniqueid } = this.props;
    // uniqueid = makeid();
    // let {
    //   editorName,
    //     charWidth,
    //     bpsPerRow,
    //     sequenceLength,
    //     annotationHeight,
    //     spaceBetweenAnnotations,
    //     row,
    //   chromatogramData
    // } = this.props;
    // path=path.replace(/ /g,'')
    // path=path.replace(/\n/g,'')
    return (
      <canvas
        ref={n => {
          console.log('yuppp')
          console.log('n:',n)
          if (n) this.canvasRef = n;
        }}
        height="100"
      />
    );
  }
}

export default Chromatogram;

function drawTrace({ traceData, charWidth = 12, startBp, peakCanvas, endBp, getGaps }) {
  const colors = {
    adenine: "green",
    thymine: "red",
    guanine: "black",
    cytosine: "blue",
    other: "pink"
  };
  const ctx = peakCanvas.getContext("2d");

  const formattedPeaks = { a: [], t: [], g: [], c: [] };
  const bottomBuffer = 0;
  // const bottomBuffer = 50;
  //   const baseBuffer = 0;
  // const baseBuffer = 35;
  const maxHeight = peakCanvas.height;
  const bpsToDrawLength =
    endBp - startBp + 1 + getGaps({ start: startBp, end: endBp }).gapsInside;
  const maxWidth = bpsToDrawLength * charWidth;
  peakCanvas.width = maxWidth;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, maxWidth, peakCanvas.height);
  const scaledHeight = maxHeight - bottomBuffer;
  let scalePct = 0;

  this.findTallest = function() {
    const aMax = Math.max(...traceData.aTrace);
    const tMax = Math.max(...traceData.tTrace);
    const gMax = Math.max(...traceData.gTrace);
    const cMax = Math.max(...traceData.cTrace);
    scalePct = scaledHeight / Math.max(aMax, tMax, gMax, cMax);
  };

  this.scalePeaks = function(traceIn) {
    const newPeaks = [];
    for (let count = 0; count < traceIn.length; count++) {
      newPeaks[count] = scalePct * traceIn[count];
    }
    return newPeaks;
  };

  this.preparePeaks = function() {
    this.findTallest();
    formattedPeaks.a = this.scalePeaks(traceData.aTrace);
    formattedPeaks.t = this.scalePeaks(traceData.tTrace);
    formattedPeaks.g = this.scalePeaks(traceData.gTrace);
    formattedPeaks.c = this.scalePeaks(traceData.cTrace);
  };

  this.drawPeaks = function(trace, lineColor) {
    ctx.beginPath();
    // ctx.moveTo(0, scaledHeight - trace[0])
    // const initialBasePosition = traceData.basePos[0]
    // trace = trace.slice(initialBasePosition)
    //loop through base positions [ 43, 53, 70, 77, ...]

    // looping through the entire sequence length
    for (let baseIndex = startBp; baseIndex < endBp; baseIndex++) {
      // each base's beginning and end of its peak
      const startBasePos = traceData.basePos[baseIndex];
      const endBasePos = traceData.basePos[baseIndex + 1];
      //grab the start and end (43, 53) , (53, 70) ...
      // looping through each base's peak
      for (
        let innerIndex = startBasePos;
        innerIndex < endBasePos;
        innerIndex++
      ) {
        // innerIndex = 43, 44, 45, ... 52
        // const element = array[baseIndex];
        // shift x-position of the beginning of the base's peak if there are gaps before the base
        const startXPosition =
          (baseIndex - startBp + getGaps(innerIndex).gapsBefore) * charWidth +
          charWidth / 3;
        // const endXPosition = (baseIndex + 1) * charWidth

        // const intervalsBetweenBases =  endBasePos - startBasePos

        // // const scaledStartXPosition = traceData.basePos[startBasePos - 1] || 0

        // const scaledStartXPosition = startBasePos - traceData.basePos[0]
        // const unscaledXPosition = innerIndex - traceData.basePos[0]

        const scalingFactor = charWidth / (endBasePos - startBasePos);
        // baseIndex < charWidth && console.log('startXPosition, scalingFactor, innerIndex - startBasePos:',startXPosition, scalingFactor, innerIndex - startBasePos)
        ctx.lineTo(
          startXPosition + scalingFactor * (innerIndex - startBasePos),
          scaledHeight - trace[innerIndex]
        );
        // ctx.moveTo(startXPosition + scalingFactor * (innerIndex - startBasePos), scaledHeight - trace[innerIndex]);
      }
    }
    // for (let counter = 1; counter < trace.length; counter++) {
    //   // const width = [endBasePos-startBasePos]
    // }
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
    for (let count = 0; count < traceData.qualNums.length; count++) {
      // ctx.lineWidth = "1";
      ctx.rect(
        (count + getGaps(count).gapsBefore) * charWidth,
        scaledHeight - traceData.qualNums[count] * scalePctQual,
        charWidth,
        traceData.qualNums[count] * scalePctQual
      );
      // ctx.strokeStyle = 'rgba(192, 192, 192, 0.1)';
      ctx.strokeStyle = "rgba(230, 230, 250, 0.1)";
      ctx.stroke();
      // ctx.fillStyle = 'rgba(220, 220, 220, 0.05)';
      ctx.fillStyle = "rgba(230, 230, 250, 0.05)";
      ctx.fill();
    }
  };

  this.paintCanvas = function() {
    this.drawQualityScoreHistogram();
    this.preparePeaks();
    this.drawPeaks(formattedPeaks.a, colors.adenine);
    this.drawPeaks(formattedPeaks.t, colors.thymine);
    this.drawPeaks(formattedPeaks.g, colors.guanine);
    this.drawPeaks(formattedPeaks.c, colors.cytosine);
    // this.drawBases();
  };
}

// componentDidMount() {
//   const painter = new drawTrace(ab1Parsed)
//   painter.paintCanvas()
// }
