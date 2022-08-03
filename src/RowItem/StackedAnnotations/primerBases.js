import React from "react";
import { map } from "lodash";
import { fudge2, realCharWidth } from "../constants";
import getYOffset from "../../CircularView/getYOffset";
import { getRangeLength } from "ve-range-utils";
import { getStructuredBases } from "./getStructuredBases";

export function getBasesToShow({
  hidePrimerBases,
  annotation,
  annotationRange,
  charWidth,
  bpsPerRow,
  fullSequence,
  iTree,
  sequenceLength
}) {
  if (hidePrimerBases) return {};
  const basesToShow = {};
  if (annotation && annotation.bases) {
    const fudge = charWidth - realCharWidth;
    const { forward, primerBindsOn } = annotation;

    const { basesNoInsertsWithMetaData, inserts, aRange } = getStructuredBases({
      ...annotation,
      fullSequence,
      annotationRange,
      sequenceLength
    });

    const annLen = getRangeLength(annotation, sequenceLength);
    const aRangeLen = getRangeLength(annotationRange, sequenceLength);
    const startOffset = annotationRange.start % bpsPerRow;
    const endOffset = bpsPerRow - (annotationRange.end % bpsPerRow);
    basesToShow.insertPaths = "";
    basesToShow.insertTicks = "";
    basesToShow.flipAnnotation = !forward;
    basesToShow.extraHeight = 0;
    const insertText = [];
    const level1Height = -10;
    const level2Height = 11;
    inserts.forEach((i, n) => {
      //loop thru all inserts
      const indexToUse = forward ? i.index : annLen - i.index - 1;
      if (
        aRange.start - (primerBindsOn === "5prime" ? 1 : 0) <= indexToUse &&
        aRange.end + (primerBindsOn === "5prime" ? 1 : 0) >= indexToUse
      ) {
        //only draw if insert falls within the annotation range
        let xStart = i.index - aRange.start - Math.ceil(0.5 * i.bases.length); //calculate initial xStart
        let xEnd = i.index - aRange.start + Math.floor(0.5 * i.bases.length);
        if (aRange.end + 3 < xEnd) {
          xStart -= xEnd - aRange.end - 3;
          xEnd -= xEnd - aRange.end - 3;
        }
        if (i.index === 0) {
          //for the first chunk, try to make it hang off the end if possible
          xStart -= xEnd - 1;
          xEnd -= xEnd - 1;
        }
        const forwAnd3Prime = forward;

        if (xStart < -(forwAnd3Prime ? startOffset : endOffset)) {
          //if the xStart is going to fall off the row to the left, correct it by moving the xStart to the right
          const offsetLeft =
            -(forwAnd3Prime ? startOffset : endOffset) - xStart;
          xStart += offsetLeft;
          xEnd += offsetLeft;
        } else if (
          xEnd + (forwAnd3Prime ? startOffset : endOffset) >
          bpsPerRow
        ) {
          //if the xStart is going to fall off the row to the right, correct it by moving the xStart to the left
          const offsetLeft =
            bpsPerRow - xEnd - (forwAnd3Prime ? startOffset : endOffset);
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
        const insertStart =
          (indexToUse - (forward ? aRange.start : aRange.end)) *
          (!forward && primerBindsOn === "5prime" ? -1 : 1);
        basesToShow.insertPaths += getInsertPath({
          xStart,
          xEnd,
          charWidth,
          level: yOffset,
          insertStart
        });

        if (indexToUse !== aRange.end + 1 && indexToUse !== -1) {
          basesToShow.insertTicks += getInsertTick({
            charWidth,
            height: level2Height,
            insertStart
          });
        }
        const textLength = charWidth * i.bases.length - fudge - fudge2;
        insertText.push(
          <text
            style={{ pointerEvents: "none" }}
            data-insert-bases={i.bases}
            className="ve-monospace-font tg-primer-bases-insert"
            textLength={textLength}
            transform={
              forward
                ? ""
                : `translate(${aRangeLen * charWidth},-5) scale(-1,-1) `
            }
            key={n}
            x={
              forward
                ? (xStart - 1) * charWidth + fudge
                : xStart * charWidth - fudge / 2
            }
            y={level1Height - yOffset * 20 - (forward ? 0 : 5)}
          >
            {i.bases.split("").map((b, i) => (
              <tspan
                key={i}
                rotate={forward ? 0 : 180}
                className="tg-no-match-seq"
                textLength={textLength}
              >
                {b}
              </tspan>
            ))}
          </text>
        );
      }
    });

    const textLength =
      charWidth * basesNoInsertsWithMetaData.length - fudge - fudge2;
    basesToShow.baseEl = (
      <React.Fragment>
        <text
          {...{
            textLength,
            y: forward ? level2Height : -(basesToShow.extraHeight - 5),
            x: forward ? fudge / 2 : fudge / 2 + 0.2 /* + diffLen * charWidth */
          }}
          style={{ pointerEvents: "none" }}
          className="ve-monospace-font tg-primer-bases"
        >
          {map(
            basesNoInsertsWithMetaData,
            ({ b, isMatch, isAmbiguousMatch }, i) => {
              return (
                <tspan
                  key={i}
                  className={
                    b === "&"
                      ? "tg-no-show-seq"
                      : isMatch
                      ? ""
                      : isAmbiguousMatch
                      ? "tg-ambiguous-match-seq"
                      : "tg-no-match-seq"
                  }
                  textLength={textLength}
                >
                  {b}
                </tspan>
              );
            }
          )}
        </text>
        {insertText}
      </React.Fragment>
    );
  }
  return basesToShow;
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
  const leftX = (xStart - 1) * charWidth;
  const rightX = (xEnd - 1) * charWidth;

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
