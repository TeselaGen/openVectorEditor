import withHover from "../../helperComponents/withHover";
import getAnnotationNameAndStartStopString from "../../utils/getAnnotationNameAndStartStopString";

import React from "react";

// import data (converter, tagDict) from alignmentTool.js
const painter = new drawTrace(converter.getTraceData());
painter.paintCanvas();
const baseCalls = converter.getDataTag(tagDict.baseCalls2);
const qualScores = converter.getDataTag(tagDict.qualNums);
// mottTrim(baseCalls, qualScores);

const scoreString = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

let basesString = "";
let convertedScores = "";
for (let baseCounter = 0; baseCounter < baseCalls.length; baseCounter++) {
  if (baseCounter != 0 && baseCounter % 80 === 0) {
    basesString += "\r\n";
    basesString += baseCalls[baseCounter];
  }
  else {
    basesString += baseCalls[baseCounter];
  }
  convertedScores += scoreString.charAt(qualScores[baseCounter]);
}

function drawTrace(traceData) {
  const colors = { adenine: "green", thymine: "red", guanine: "black", cytosine: "blue", other: "pink" };
  const peakCanvas = document.getElementById("peakCanvas");
  const ctx = peakCanvas.getContext("2d");

  const formattedPeaks = { a: [], t: [], g: [], c: [] };
  const bottomBuffer = 50;
  const baseBuffer = 35;
  const maxHeight = peakCanvas.height;
  const maxWidth = traceData.basePos[traceData.basePos.length - 1];
  peakCanvas.width = maxWidth;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, maxWidth, peakCanvas.height);
  const scaledHeight = maxHeight - bottomBuffer;
  let scalePct = 0;

  this.findTallest = () => {
    const aMax = Math.max(...traceData.aTrace);
    const tMax = Math.max(...traceData.tTrace);
    const gMax = Math.max(...traceData.gTrace);
    const cMax = Math.max(...traceData.cTrace);
    scalePct = scaledHeight / Math.max(aMax, tMax, gMax, cMax);
  }

  this.scalePeaks = traceIn => {
    const newPeaks = [];
    for (let count = 0; count < traceIn.length; count++) {
      newPeaks[count] = scalePct * traceIn[count];
    }
    return newPeaks;
  }

  this.preparePeaks = function () {
    this.findTallest();
    formattedPeaks.a = this.scalePeaks(traceData.aTrace);
    formattedPeaks.t = this.scalePeaks(traceData.tTrace);
    formattedPeaks.g = this.scalePeaks(traceData.gTrace);
    formattedPeaks.c = this.scalePeaks(traceData.cTrace);
  }

  this.drawPeaks = (trace, lineColor) => {
    ctx.beginPath();
    ctx.moveTo(0, scaledHeight - trace[0])
    for (let counter = 1; counter < trace.length; counter++) {
      ctx.lineTo(counter, scaledHeight - trace[counter]);
      ctx.moveTo(counter, scaledHeight - trace[counter]);
    }
    ctx.strokeStyle = lineColor;
    ctx.stroke();
  }

  this.drawBases = () => {
    ctx.font = "24px serif";
    const xOffset = -2;

    traceData.baseCalls.forEach((baseCall, count) => {
      switch (baseCall) {
        case "A":
          ctx.fillStyle = colors.adenine;
          break;
        case "T":
          ctx.fillStyle = colors.thymine;
          break;
        case "G":
          ctx.fillStyle = colors.guanine;
          break;
        case "C":
          ctx.fillStyle = colors.cytosine;
          break;
        default:
          ctx.fillStyle = colors.other;
      }
      ctx.fillText(baseCall, traceData.basePos[count] + xOffset, maxHeight - baseBuffer);
    });
  }

  this.paintCanvas = function () {
    this.preparePeaks();
    this.drawPeaks(formattedPeaks.a, colors.adenine);
    this.drawPeaks(formattedPeaks.t, colors.thymine);
    this.drawPeaks(formattedPeaks.g, colors.guanine);
    this.drawPeaks(formattedPeaks.c, colors.cytosine);
    this.drawBases();
  }
}

function Chromatogram(props) {
  let {
    hoverActions,
    hoverProps: { className },
    widthInBps,
    charWidth,
    height,
    rangeType,
    forward,
    name,
    pointiness = 8,
    fontWidth = 12,
    chromatogramClicked,
    chromatogramRightClicked,
    annotation
  } = props;

  let width = widthInBps * charWidth;
  let charWN = charWidth; //charWN is normalized
  if (charWidth < 15) {
    //allow the arrow width to adapt
    if (width > 15) {
      charWN = 15; //tnr: replace 15 here with a non-hardcoded number..
    } else {
      charWN = width;
    }
  }
  let widthMinusOne = width - charWN;
  let path;
  // starting from the top left of the feature
  if (rangeType === "middle") {
    //draw a rectangle
    path = `
        M 0,0 
        L ${width - pointiness / 2},0
        Q ${width + pointiness / 2},${height / 2} ${width - pointiness / 2},${
      height
    }
        L ${0},${height}
        Q ${pointiness},${height / 2} ${0},${0}
        z`;
  } else if (rangeType === "start") {
    path = `
        M 0,0 
        L ${width - pointiness / 2},0 
        Q ${width + pointiness / 2},${height / 2} ${width - pointiness / 2},${
      height
    }
        L 0,${height} 
        z`;
  } else if (rangeType === "beginningAndEnd") {
    path = `
        M 0,0 
        L ${widthMinusOne},0 
        L ${width},${height / 2} 
        L ${widthMinusOne},${height} 
        L 0,${height} 
        z`;
  } else {
    path = `
      M 0,0 
      L ${widthMinusOne},0 
      L ${width},${height / 2} 
      L ${widthMinusOne},${height} 
      L 0,${height} 
      Q ${pointiness},${height / 2} ${0},${0}
      z`;
  }
  let nameToDisplay = name;
  let textLength = name.length * fontWidth;
  let textOffset = widthMinusOne / 2;
  if (textLength > widthMinusOne) {
    textOffset = 0;
    nameToDisplay = "";
  }
  // path=path.replace(/ /g,'')
  // path=path.replace(/\n/g,'')
  return (
    <g
      {...hoverActions}
      className={"veRowViewChromatogram clickable " + className}
      onClick={function(event) {
        chromatogramClicked({ annotation, event });
      }}
      onContextMenu={function(event) {
        chromatogramRightClicked({ annotation, event });
      }}
    >
      <title>{getAnnotationNameAndStartStopString(annotation)}</title>
      <path
        strokeWidth="1"
        stroke="purple"
        fill="purple"
        fillOpacity={0}
        transform={forward ? null : "translate(" + width + ",0) scale(-1,1) "}
        d={path}
      />
      <text
        style={{ fill: "black", fontSize: ".75em" }}
        transform={`translate(${textOffset},${height - 2})`}
      >
        {nameToDisplay}
      </text>
    </g>
  );
}

export default withHover(Chromatogram);
