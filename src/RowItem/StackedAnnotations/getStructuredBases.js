import { clone } from "lodash";
import { getRangeLength, getSequenceWithinRange } from "ve-range-utils";
import { getComplementSequenceString } from "ve-sequence-utils";

export function getStructuredBases({
  annotationRange,
  forward,
  bases,
  start,
  end,
  fullSeq,
  primerBindsOn,
  sequenceLength
}) {
  //  console.log(`annotationRange:`,annotationRange)
  //  console.log(`bases:`,bases)
  const aRange = {
    //tnr: this probably needs to be changed in case annotation wraps origin
    start: annotationRange.start - start,
    end: annotationRange.end - start
  };
  const r = {
    aRange,
    basesNoInserts: bases,
    inserts: []
  };

  const annLen = getRangeLength({ start, end }, sequenceLength);
  const baseLen = bases.length;
  const diffLen = baseLen - annLen;
  if (diffLen > 0) {
    r.basesNoInserts = bases.slice(
      primerBindsOn === "5prime" ? 0 : diffLen,
      primerBindsOn === "5prime" ? annLen : baseLen
    );
    const insertBases = bases.slice(
      primerBindsOn === "5prime" ? annLen : 0,
      primerBindsOn === "5prime" ? baseLen : diffLen
    );

    r.inserts = [
      {
        bases: insertBases,
        index: primerBindsOn === "5prime" ? annLen : 0
      }
    ];
  }
  const basesForRange = getSequenceWithinRange(
    aRange,
    forward ? r.basesNoInserts : r.basesNoInserts.split("").reverse().join("")
  );
  r.basesNoInsertsWithMetaData = basesForRange.split("").map((b, i) => {
    const indexOfBase = i + annotationRange.start;
    let seqForBase = (fullSeq && fullSeq[indexOfBase]) || "";
    if (!forward) {
      seqForBase = getComplementSequenceString(seqForBase);
    }
    const isMatch = seqForBase.toLowerCase() === b.toLowerCase();
    return {
      b,
      isMatch
    };
  });
  r.allBasesWithMetaData = clone(r.basesNoInsertsWithMetaData);
  if (!forward) {
    r.allBasesWithMetaData = r.allBasesWithMetaData.reverse();
  }
  r.inserts
    .sort((a, b) => a.index - b.index)
    .forEach(({ bases, index }) => {
      // console.log(`bases:`,bases)
      // console.log(`index:`,index)
      r.allBasesWithMetaData.splice(
        index,
        0,
        ...bases.split("").map((b) => ({ b, isMatch: false }))
      );
    });

  return r;
}
