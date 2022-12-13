import { showContextMenu } from "teselagen-react-components";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@blueprintjs/core";
import {
  chromatogramMenu,
  useShowChromQualScores
} from "../../utils/useChromatogramPrefs";
import classNames from "classnames";

export default function Chromatogram(props) {
  const { isRowView, chromatogramData, row, getGaps, charWidth } = props;
  const [showChromQualScores] = useShowChromQualScores();
  let [scalePct, setScalePct] = useState(0.05);
  const [hasDrawnOnce, setHasDrawnOnce] = useState(false);
  if (props.scalePct) scalePct = props.scalePct;
  if (props.setScalePct) setScalePct = props.setScalePct;
  const canvasRef = useRef();
  const gapsBeforeRow = getGaps(row.start).gapsBefore;
  useEffect(() => {
    if (
      !chromatogramData ||
      !chromatogramData.baseTraces ||
      !canvasRef.current
    ) {
      return true;
    }
    const painter = new drawTrace({
      isRowView,
      showChromQualScores,
      peakCanvas: canvasRef.current,
      traceData: chromatogramData,
      charWidth: charWidth,
      startBp: row.start,
      endBp: row.end,
      getGaps,
      gapsBeforeRow,
      scalePct: scalePct
    });
    painter.paintCanvas();
    setHasDrawnOnce(true);
  }, [
    setHasDrawnOnce,
    showChromQualScores,
    chromatogramData,
    charWidth,
    row.start,
    row.end,
    gapsBeforeRow,
    isRowView,
    scalePct,
    getGaps,
    canvasRef
  ]);
  const marginLeft = gapsBeforeRow * charWidth;

  return (
    <div
      className={classNames("chromatogram", {
        noQualityScores: !showChromQualScores
      })}
      style={{
        position: "relative"
      }}
      onContextMenu={(e) => {
        showContextMenu([chromatogramMenu], undefined, e);
      }}
    >
      <Button
        minimal
        data-tip="Scale Chromatogram Up"
        className="scaleChromatogramButtonUp"
        icon="caret-up"
        onClick={(e) => {
          e.stopPropagation();
          setScalePct(scalePct + 0.01);
        }}
        style={{
          zIndex: 10,
          position: "sticky",
          left: 145
        }}
      />
      <Button
        minimal
        data-tip="Scale Chromatogram Down"
        className="scaleChromatogramButtonDown"
        icon="caret-down"
        onClick={(e) => {
          e.stopPropagation();
          setScalePct(scalePct - 0.01);
        }}
        style={{
          zIndex: 10,
          position: "sticky",
          left: 175
        }}
      />
      <br />

      <div
        className={classNames({
          "chromatogram-trace": true,
          "chromatogram-trace-initialized": hasDrawnOnce
        })}
        style={{
          zIndex: 1,
          position: "relative",
          left: 0,
          // left: posOfSeqRead,
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
        // ref={(n) => {
        //   if (n) this.chromatogramRef = n;
        // }}
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

        <canvas style={{ marginLeft }} ref={canvasRef} height="100" />
      </div>
    </div>
  );
}

function drawTrace({
  traceData,
  charWidth,
  startBp,
  peakCanvas,
  endBp,
  getGaps,
  gapsBeforeRow,
  showChromQualScores,
  // isRowView,
  scalePct
}) {
  const colors = {
    adenine: "green",
    thymine: "red",
    guanine: "black",
    cytosine: "blue",
    other: "#ac68cc"
  };
  const ctx = peakCanvas.getContext("2d");

  const bottomBuffer = 0;
  const maxHeight = peakCanvas.height;

  const seqLengthWithGaps =
    endBp - startBp + 1 + getGaps(endBp).gapsBefore - gapsBeforeRow;
  const maxWidth = seqLengthWithGaps * charWidth;

  peakCanvas.width = maxWidth;

  const scaledHeight = maxHeight - bottomBuffer;

  this.drawPeaks = function (traceType, lineColor) {
    ctx.beginPath();
    //loop through base positions [ 43, 53, 70, 77, ...]
    // looping through the entire sequence length
    for (let baseIndex = startBp; baseIndex <= endBp; baseIndex++) {
      // each base's beginning and end of its peak
      // grab the start and end (43, 53) , (53, 70) ...
      // looping through each base's peak
      const traceForIndex = traceData.baseTraces[baseIndex][traceType];
      const gapsBefore = getGaps(baseIndex - 1).gapsBefore || 0;
      const gapsAt = getGaps(baseIndex).gapsBefore;
      const startXPosition =
        (baseIndex + gapsAt - startBp - gapsBeforeRow) * charWidth;
      const hasGaps = gapsBefore !== gapsAt;
      const traceLength = traceForIndex.length;
      const tracePointSpacing = charWidth / traceLength;
      // eslint-disable-next-line no-loop-func
      traceForIndex.forEach((_tracePoint, tracePointIndex) => {
        const tracePoint = scaledHeight - scalePct * _tracePoint;
        if (hasGaps && tracePointIndex === 0) {
          ctx.moveTo(startXPosition, tracePoint);
        }
        ctx.lineTo(
          startXPosition + tracePointSpacing * tracePointIndex,
          tracePoint
        );
      });
    }
    ctx.strokeStyle = lineColor;
    ctx.stroke();
  };

  this.drawQualityScoreHistogram = function () {
    if (!traceData.qualNums || !showChromQualScores) return;
    const qualMax = Math.max(...traceData.qualNums);
    const scalePctQual = scaledHeight / qualMax;

    for (let baseIndex = startBp; baseIndex <= endBp; baseIndex++) {
      const gapsAt = getGaps(baseIndex).gapsBefore;
      const startXPosition =
        (baseIndex + gapsAt - startBp - gapsBeforeRow) * charWidth;

      ctx.rect(
        startXPosition,
        scaledHeight - traceData.qualNums[baseIndex] * scalePctQual,
        charWidth,
        traceData.qualNums[baseIndex] * scalePctQual
      );
    }
    ctx.fillStyle = "#cfc3c3";
    ctx.fill();
    ctx.strokeStyle = "#e9e3f4";
    ctx.stroke();
  };

  this.paintCanvas = function () {
    this.drawQualityScoreHistogram();
    this.drawPeaks("aTrace", colors.adenine);
    this.drawPeaks("tTrace", colors.thymine);
    this.drawPeaks("gTrace", colors.guanine);
    this.drawPeaks("cTrace", colors.cytosine);
    ctx.closePath();
  };
}
