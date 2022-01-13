import React from "react";
import { map } from "lodash";
import { fudge2, realCharWidth } from "../constants";
import getSequenceWithinRange from "ve-range-utils/lib/getSequenceWithinRange";
import { getComplementSequenceString } from "ve-sequence-utils";
import getYOffset from "../../CircularView/getYOffset";

export function getBasesToShow({
  annotation,
  annotationRange,
  charWidth,
  bpsPerRow,
  fullSeq,
  iTree
}) {
  const basesToShow = {};
  if (annotation && annotation.bases) {
    const fudge = charWidth - realCharWidth;
    const forward = annotation.forward;
    const { basesNoInserts, inserts } = getStructuredBases(annotation.bases);
    const aRange = {
      //tnr: this probably needs to be changed in case annotation wraps origin
      start: annotationRange.start - annotation.start,
      end: annotationRange.end - annotation.start
    };
    const basesForRange = getSequenceWithinRange(
      aRange,
      annotation.forward
        ? basesNoInserts
        : basesNoInserts.split("").reverse().join("")
    );

    const startOffset = annotationRange.start % bpsPerRow;
    const endOffset = bpsPerRow - (annotationRange.end % bpsPerRow);
    basesToShow.insertPaths = "";
    basesToShow.insertTicks = "";
    basesToShow.flipAnnotation = !annotation.forward;
    basesToShow.extraHeight = 0;
    const insertText = [];
    const level1Height = forward ? -10 : -3;
    const level2Height = 11;
    inserts.forEach((i, n) => {
      //loop thru all inserts
      if (aRange.start <= i.index && aRange.end >= i.index) {
        //only draw if insert falls within the annotation range
        let xStart = i.index - aRange.start - Math.ceil(0.5 * i.bases.length); //calculate initial xStart
        let xEnd = i.index - aRange.start + Math.ceil(0.5 * i.bases.length);
        if (i.index === 0) {
          //for the first chunk, try to make it hang off the end if possible
          xStart -= xEnd - 1;
          xEnd -= xEnd - 1;
        }
        if (xStart < -(forward ? startOffset : endOffset)) {
          //if the xStart is going to fall off the row to the left, correct it by moving the xStart to the right
          const offsetLeft = -(forward ? startOffset : endOffset) - xStart;
          xStart += offsetLeft;
          xEnd += offsetLeft;
        } else if (xEnd + (forward ? startOffset : endOffset) > bpsPerRow) {
          //if the xStart is going to fall off the row to the right, correct it by moving the xStart to the left
          const offsetLeft =
            bpsPerRow - xEnd - (forward ? startOffset : endOffset);
          xStart += offsetLeft;
          xEnd += offsetLeft;
        }
        // use an interval tree to determine the level the primer insert should be on to not overlap with other inserts
        const yOffset = getYOffset(iTree, xStart, xEnd);
        iTree.insert(xStart, xEnd, {
          //tnr: pass an initial level in the case that the underlying primer ranges themselves are overlapping
          ...annotationRange,
          yOffset
        });

        basesToShow.extraHeight = Math.max(
          basesToShow.extraHeight,
          15 + yOffset * 20
        );
        basesToShow.insertPaths += getInsertPath({
          xStart,
          xEnd,
          charWidth,
          level: yOffset,
          insertStart: i.index - aRange.start
        });
        basesToShow.insertTicks += getInsertTick({
          charWidth,
          height: level2Height,
          insertStart: i.index - aRange.start
        });
        const textLength = charWidth * i.bases.length - fudge - fudge2;
        const xToUse = xStart * charWidth - fudge;
        insertText.push(
          <text
            style={{ pointerEvents: "none" }}
            className="ve-monospace-font"
            textLength={textLength}
            key={n}
            x={
              forward
                ? xToUse
                : ((annotationRange.end % bpsPerRow) - xEnd - 10) * charWidth -
                  fudge
            }
            y={forward ? level1Height - yOffset * 20 : yOffset * 20 - 10}
          >
            {i.bases.split("").map((b, i) => (
              <tspan
                key={i}
                className="tg-no-match-seq"
                fill="red"
                textLength={textLength}
              >
                {b}
              </tspan>
            ))}
          </text>
        );
      }
    });

    const textLength = charWidth * basesForRange.length - fudge - fudge2;

    basesToShow.baseEl = (
      <React.Fragment>
        <text
          {...{
            textLength,
            y: forward ? level2Height : -(basesToShow.extraHeight - 5),
            x: forward ? fudge / 2 : fudge / 2 + 0.2
          }}
          style={{ pointerEvents: "none" }}
          className="ve-monospace-font"
        >
          {map(basesForRange.split(""), (b, i) => {
            const indexOfBase = i + annotationRange.start;
            let seqForBase = (fullSeq && fullSeq[indexOfBase]) || "";
            if (!annotation.forward) {
              seqForBase = getComplementSequenceString(seqForBase);
            }
            const isMatch = seqForBase.toLowerCase() === b.toLowerCase();
            return (
              <tspan
                className={isMatch ? "" : "tg-no-match-seq"}
                fill={isMatch ? "black" : "red"}
                textLength={textLength}
              >
                {b}
              </tspan>
            );
          })}
        </text>
        {insertText}
      </React.Fragment>
    );
  }
  return basesToShow;
}

function getStructuredBases(bps) {
  const r = {
    basesNoInserts: bps,
    inserts: []
  };
  let m;

  do {
    m = /\([^)]*\)/g.exec(r.basesNoInserts);
    if (m) {
      r.basesNoInserts = r.basesNoInserts.replace(m[0], "");
      const matchInner = m[0].replaceAll(")", "").replaceAll("(", "");
      r.inserts.push({
        bases: matchInner,
        index: m.index
      });
    }
  } while (m);
  return r;
}

function getInsertTick({ insertStart, charWidth, height }) {
  if (insertStart === 0) return "";
  const insertLocation = insertStart * charWidth;

  const jutUp = `
  L ${insertLocation - 1},${height + 5}
  L ${insertLocation - 1},${height - 4}
  L ${insertLocation - 1},${height + 5}
   `;
  return jutUp;
}

function getInsertPath({ charWidth, xStart, xEnd, insertStart, level = 0 }) {
  const insertLocation = insertStart * charWidth;
  const insertHeight = 15;
  const levelHeight = -5 - level * 20;
  const leftX = xStart * charWidth - charWidth / 2;
  const rightX = xEnd * charWidth - charWidth / 2;

  const jutUp = `
   L ${insertLocation - 6},${0}
   L ${insertLocation - 6},${levelHeight}
   L ${leftX},${levelHeight}
   L ${leftX},${-insertHeight + levelHeight}

   L ${rightX},${-insertHeight + levelHeight}
   L ${rightX},${levelHeight}
   L ${insertLocation + 4},${levelHeight}
   L ${insertLocation + 4},${0}
   `;
  return jutUp;
}
