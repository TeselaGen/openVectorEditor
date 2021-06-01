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

    forEach(
      omitBy(seqsToAnnotateById, (s) => !s.sequence.length),
      ({ circular, sequence }, id) => {
        function getMatches({ seqToMatchAgainst, isReverse, seqLen }) {
          let match;
          // const matches = []
          while ((match = reg.exec(seqToMatchAgainst))) {
            const { index: matchStart, 0: matchSeq } = match;
            if (matchStart >= seqLen) return;
            const matchEnd = matchStart + matchSeq.length;
            const range = {
              start: matchStart,
              end: normalizePositionByRangeLength(matchEnd - 1, seqLen)
            };
            if (!annotationsToAddBySeqId[id]) annotationsToAddBySeqId[id] = [];
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

  let prevBp;
  // let hitHash;
  let hitLeftCaret;
  let hitRightCaret;

  for (const bp of regString.replace("(", "").replace(")", "")) {
    /* eslint-disable no-loop-func*/
    /* eslint-disable no-inner-declarations*/
    function maybeAddQuestion() {
      if (hitRightCaret) {
        newstr += "?";
      }
    }
    /* eslint-enable no-loop-func*/
    /* eslint-enable no-inner-declarations*/

    const ambigVal = ambiguous_dna_values[bp.toUpperCase()];

    if (ambigVal && ambigVal.length > 1) {
      if (ambigVal.length === 4) {
        newstr += ".";
      } else {
        newstr += `[${ambigVal}]`;
      }
      maybeAddQuestion();
      continue;
    }
    if (bp === "#") {
      if (hitRightCaret) throw new Error("Error converting regex");

      newstr += prevBp ? `[^${prevBp}]*?` : `.*?`;
      // hitHash = true;
      continue;
    }
    if (bp === "<") {
      // if (hitHash) throw new Error("Error converting regex");
      if (hitRightCaret) throw new Error("Error converting regex");
      if (hitLeftCaret) throw new Error("Error converting regex");
      let holder = "";
      let shouldAddQuesMark = true;
      let closingBraceHit;
      for (let index = 0; index < newstr.length; index++) {
        const char = newstr[index];
        const nextChar = newstr[index + 1];
        if (char === "[") {
          shouldAddQuesMark = false;
        } else if (char === "]" || closingBraceHit) {
          closingBraceHit = true;
          if (ambiguous_dna_values[nextChar] || nextChar === "[") {
            shouldAddQuesMark = true;
            closingBraceHit = false;
          }
        }
        holder += char;
        if (shouldAddQuesMark && char !== "?") holder += "?";
      }
      newstr = holder;
      hitLeftCaret = true;
      continue;
    }
    if (bp === ">") {
      if (hitRightCaret) throw new Error("Error converting regex");
      hitRightCaret = true;
      continue;
    }
    newstr += bp;
    maybeAddQuestion();

    prevBp = bp;
  }
  return newstr;
}
