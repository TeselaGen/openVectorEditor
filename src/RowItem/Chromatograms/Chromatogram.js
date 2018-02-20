import React from "react";


class Chromatogram extends React.Component {

  componentDidMount() {
    this.updatePeakDrawing()
  }
  componentWillReceiveProps(newProps) {
    if (
      newProps.chromatogramData !== this.props.chromatogramData
    ) {
      this.updatePeakDrawing()
    }
  }
  updatePeakDrawing = () => {
    const {chromatogramData, charWidth} = this.props
    const painter = new drawTrace(chromatogramData, charWidth)
    painter.paintCanvas()

  }

  render(){
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
      <canvas id="peakCanvas" height="100" ></canvas>
    );
  }
}

export default Chromatogram;


function drawTrace (traceData, charWidth = 12) {
  const colors = {adenine:"green", thymine:"red", guanine:"black", cytosine:"blue", other:"pink"};
  const peakCanvas = document.getElementById("peakCanvas");
  const ctx = peakCanvas.getContext("2d");
  
  const formattedPeaks = {a:[], t:[], g:[], c:[]};
  const bottomBuffer = 0;
  // const bottomBuffer = 50;
  const baseBuffer = 0;
  // const baseBuffer = 35;
  const maxHeight = peakCanvas.height;
  const maxWidth = traceData.basePos.length * charWidth
  peakCanvas.width = maxWidth;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, maxWidth, peakCanvas.height);
  const scaledHeight = maxHeight - bottomBuffer;
  let scalePct = 0;

  this.findTallest = function () {
      const aMax = Math.max(...traceData.aTrace);
      const tMax = Math.max(...traceData.tTrace);
      const gMax = Math.max(...traceData.gTrace);
      const cMax = Math.max(...traceData.cTrace);
      scalePct = scaledHeight / Math.max(aMax, tMax, gMax, cMax);
  }

  this.scalePeaks = function (traceIn) {
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

  this.drawPeaks = function(trace, lineColor) {
      ctx.beginPath();
      ctx.moveTo(0, scaledHeight - trace[0])
      // const initialBasePosition = traceData.basePos[0]  
      // trace = trace.slice(initialBasePosition)
    console.log('traceData.basePos.length, charWidth, traceData.basePos.length * charWidth:',traceData.basePos.length, charWidth, traceData.basePos.length * charWidth)
      //loop through base positions [ 43, 53, 70, 77, ...]
      for (let baseIndex = 0; baseIndex < traceData.basePos.length - 1; baseIndex++) {
        const startBasePos = traceData.basePos[baseIndex]  
        const endBasePos = traceData.basePos[baseIndex + 1]
        //grab the start and end (43, 53) , (53, 70) ...
        for (let innerIndex = startBasePos; innerIndex < endBasePos; innerIndex++) {
          // innerIndex = 43, 44, 45, ... 52
          // const element = array[baseIndex];
          const startXPosition = baseIndex * charWidth + charWidth/3
          // const endXPosition = (baseIndex + 1) * charWidth

          // const intervalsBetweenBases =  endBasePos - startBasePos
          

          // // const scaledStartXPosition = traceData.basePos[startBasePos - 1] || 0
          
          // const scaledStartXPosition = startBasePos - traceData.basePos[0]
          // const unscaledXPosition = innerIndex - traceData.basePos[0]
          
          const scalingFactor = charWidth/ (endBasePos - startBasePos)
          // baseIndex < charWidth && console.log('startXPosition, scalingFactor, innerIndex - startBasePos:',startXPosition, scalingFactor, innerIndex - startBasePos)
          ctx.lineTo(startXPosition + scalingFactor * (innerIndex - startBasePos), scaledHeight - trace[innerIndex]);
          ctx.moveTo(startXPosition + scalingFactor * (innerIndex - startBasePos), scaledHeight - trace[innerIndex]);
        }
      }
      for (let counter = 1; counter < trace.length; counter++) {

          
          // const width = [endBasePos-startBasePos]

          
      }
      ctx.strokeStyle = lineColor;
      ctx.stroke();
  }
  this.drawPeaksSvg = function(trace, lineColor) {
      ctx.beginPath();
      ctx.moveTo(0, scaledHeight - trace[0])
      // const initialBasePosition = traceData.basePos[0]  
      // trace = trace.slice(initialBasePosition)

      //loop through base positions [ 43, 53, 70, 77, ...]
      for (let baseIndex = 0; baseIndex < traceData.basePos.length - 1; baseIndex++) {
        const startBasePos = traceData.basePos[baseIndex]  
        const endBasePos = traceData.basePos[baseIndex + 1]
        //grab the start and end (43, 53) , (53, 70) ...
        for (let innerIndex = startBasePos; innerIndex < endBasePos; innerIndex++) {
          // innerIndex = 43, 44, 45, ... 52
          // const element = array[baseIndex];
          const startXPosition = baseIndex * charWidth
          // const endXPosition = (baseIndex + 1) * charWidth

          // const intervalsBetweenBases =  endBasePos - startBasePos
          

          // // const scaledStartXPosition = traceData.basePos[startBasePos - 1] || 0
          
          // const scaledStartXPosition = startBasePos - traceData.basePos[0]
          // const unscaledXPosition = innerIndex - traceData.basePos[0]
          
          const scalingFactor = charWidth/ (endBasePos - startBasePos)
          // baseIndex < charWidth && console.log('startXPosition, scalingFactor, innerIndex - startBasePos:',startXPosition, scalingFactor, innerIndex - startBasePos)
          ctx.lineTo(startXPosition + scalingFactor * (innerIndex - startBasePos), scaledHeight - trace[innerIndex]);
          ctx.moveTo(startXPosition + scalingFactor * (innerIndex - startBasePos), scaledHeight - trace[innerIndex]);
        }
      }
      for (let counter = 1; counter < trace.length; counter++) {

          
          // const width = [endBasePos-startBasePos]

          
      }
      ctx.strokeStyle = lineColor;
      ctx.stroke();
  }

  this.drawBases = function () {
      //ctx.font = "24px serif";
      for (let count = 0; count < traceData.baseCalls.length; count++) {
          const baseCall = traceData.baseCalls[count];
          switch(baseCall) {
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
          let positionToUse = count * charWidth
          
          ctx.fillText(baseCall, positionToUse, maxHeight - baseBuffer);
      }
  }

  this.paintCanvas = function () {
      this.preparePeaks();
      this.drawPeaks(formattedPeaks.a, colors.adenine);
      this.drawPeaks(formattedPeaks.t, colors.thymine);
      this.drawPeaks(formattedPeaks.g, colors.guanine);
      this.drawPeaks(formattedPeaks.c, colors.cytosine);
      // this.drawBases();
  }
}


// componentDidMount() {
//   const painter = new drawTrace(ab1Parsed)
//   painter.paintCanvas()
// }