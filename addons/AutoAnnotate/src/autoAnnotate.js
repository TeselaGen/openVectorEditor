/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */
import { getReverseComplementSequenceString, bioData } from "ve-sequence-utils";
import { forEach, omitBy } from "lodash";
import {
  normalizePositionByRangeLength,
  reversePositionInRange
} from "ve-range-utils";

const { ambiguous_dna_values } = bioData;
//seqsToAnnotateById must not be length = 0
export function autoAnnotate({
  seqsToAnnotateById,
  annotationsToCheckById,
  compareName,
  warnIfMoreThan
}) {
  const annotationsToAddBySeqId = {};

  forEach(annotationsToCheckById, (ann) => {
    const reg = new RegExp(ann.sequence, "gi");
    console.log(`reg:`, reg);
    forEach(
      omitBy(seqsToAnnotateById, (s) => !s.sequence.length),
      ({ circular, sequence }, id) => {
        function getMatches({ seqToMatchAgainst, isReverse, seqLen }) {
          let match;
          let lastMatch;
          // const matches = []
          try {
            while ((match = reg.exec(seqToMatchAgainst))) {
              const { index: matchStart, 0: matchSeq } = match;
              if (matchStart >= seqLen) return;
              console.log(`lastMatch:`, lastMatch);
              const matchEnd = matchStart + matchSeq.length;
              if (lastMatch) {
                if (matchStart > lastMatch.start && matchEnd <= lastMatch.end) {
                  reg.lastIndex = match.index + 1;
                  continue;
                }
              }
              lastMatch = {
                start: matchStart,
                end: matchEnd
              };
              const range = {
                start: matchStart,
                end: normalizePositionByRangeLength(matchEnd - 1, seqLen)
              };
              if (!annotationsToAddBySeqId[id])
                annotationsToAddBySeqId[id] = [];
              annotationsToAddBySeqId[id].push({
                ...(isReverse
                  ? {
                      start: reversePositionInRange(range.end, seqLen),
                      end: reversePositionInRange(range.start, seqLen)
                    }
                  : range),
                strand: isReverse ? -1 : 1,
                id: ann.id
              });

              reg.lastIndex = match.index + 1;
            }
          } catch (error) {
            console.error(`error:`, error);
          }
        }
        const seqLen = sequence.length;

        const revSeq = getReverseComplementSequenceString(sequence);
        getMatches({
          seqLen,
          seqToMatchAgainst: circular ? sequence + sequence : sequence
        });
        getMatches({
          seqLen,
          isReverse: true,
          seqToMatchAgainst: circular ? revSeq + revSeq : revSeq
        });
      }
    );
  });

  //loop through all patterns and get all matches

  const toReturn = {};

  forEach(annotationsToAddBySeqId, (anns, id) => {
    const origSeq = seqsToAnnotateById[id];
    const alreadyExistingAnnsByStartEnd = {};
    forEach(origSeq.annotations, (ann) => {
      alreadyExistingAnnsByStartEnd[getStartEndStr(ann, { compareName })] = ann;
    });
    const warningCounter = {};
    const toAdd = anns
      .filter((ann) => {
        const alreadyExistingAnn =
          alreadyExistingAnnsByStartEnd[getStartEndStr(ann, { compareName })];
        if (alreadyExistingAnn) return false;
        if (warnIfMoreThan) {
          warningCounter[ann.id] = (warningCounter[ann.id] || 0) + 1;
        }
        return true;
      })
      .sort((a, b) => a.start - b.start);
    if (toAdd.length) {
      toReturn[id] = toAdd;
    }
    warnIfMoreThan &&
      forEach(warningCounter, (num, annId) => {
        if (num > warnIfMoreThan) {
          toReturn.__more_than_warnings = toReturn.__more_than_warnings || {};
          toReturn.__more_than_warnings[id] =
            toReturn.__more_than_warnings[id] || [];
          toReturn.__more_than_warnings[id].push(annId);
        }
      });
  });
  return toReturn;
}

function getStartEndStr(
  { start, end, name, strand, forward },
  { compareName }
) {
  const isReverse = strand === -1 || forward === false;
  return `${start}-${end}-${isReverse ? "rev" : "for"}-${
    compareName ? name : ""
  }`;
}

export function convertApELikeRegexToRegex(regString = "") {
  let newstr = "";
  let rightOfCaretHolder = "";
  let afterRightCaretHolder = "";
  let beforeRightCaret = "";
  let prevBp;
  let hitLeftCaret;
  let hitRightCaret;

  for (const bp of regString.replace("(", "").replace(")", "")) {
    /* eslint-disable no-loop-func*/
    /* eslint-disable no-inner-declarations*/
    function maybeHandleRightCaret(justAdded) {
      if (hitRightCaret) {
        rightOfCaretHolder += justAdded;
        afterRightCaretHolder = `${rightOfCaretHolder}${
          afterRightCaretHolder.length ? "|" : ""
        }${afterRightCaretHolder}`;
      }
    }
    /* eslint-enable no-loop-func*/
    /* eslint-enable no-inner-declarations*/
    const ambigVal = ambiguous_dna_values[bp.toUpperCase()];
    if (ambigVal && ambigVal.length > 1) {
      let valToUse;
      if (ambigVal.length === 4) {
        valToUse = ".";
      } else {
        valToUse = `[${ambigVal}]`;
      }
      newstr += valToUse;
      maybeHandleRightCaret(valToUse);
      continue;
    }
    if (bp === "#") {
      if (hitRightCaret) throw new Error("Error converting regex");
      const valToUse = prevBp ? `[^${prevBp}]*?` : `.*?`;
      newstr += valToUse;
      maybeHandleRightCaret(valToUse);
      continue;
    }
    if (bp === "<") {
      if (hitRightCaret) throw new Error("Error converting to regex");
      if (hitLeftCaret) throw new Error("Error converting to regex");
      let holder = "";
      let stringToAdd = "";
      let isGroupClosed = true;
      let closingBraceHit;
      const groups = [];
      for (let index = 0; index < newstr.length; index++) {
        const char = newstr[index];
        const nextChar = newstr[index + 1];
        if (char === "[") {
          isGroupClosed = false;
        } else if (char === "]" || closingBraceHit) {
          closingBraceHit = true;
          if (ambiguous_dna_values[nextChar] || nextChar === "[") {
            isGroupClosed = true;
            closingBraceHit = false;
          }
        }
        holder += char;
        if (isGroupClosed) {
          groups.push(holder);
          holder = "";
        }
      }
      let concattedEls = "";
      groups.reverse();
      groups.forEach((g) => {
        concattedEls = g + concattedEls;
        stringToAdd = `${concattedEls}${
          stringToAdd.length ? "|" : ""
        }${stringToAdd}`;
      });
      newstr = `(${stringToAdd})?`;
      hitLeftCaret = true;
      continue;
    }
    if (bp === ">") {
      if (hitRightCaret) throw new Error("Error converting regex");
      hitRightCaret = true;
      beforeRightCaret = newstr;
      continue;
    }
    newstr += bp;
    maybeHandleRightCaret(bp);
    prevBp = bp;
  }
  if (hitRightCaret) {
    newstr = `${beforeRightCaret}(${afterRightCaretHolder})?`;
  }
  return newstr;
}
