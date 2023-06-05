import { clone } from "lodash";
import { getRangeLength, getSequenceWithinRange } from "@teselagen/range-utils";
import { getComplementSequenceString } from "@teselagen/sequence-utils";
import { bioData } from "@teselagen/sequence-utils";
const { ambiguous_dna_values } = bioData;
export function getStructuredBases({
  annotationRange,
  forward,
  bases = "",
  start,
  end,
  fullSequence,
  primerBindsOn,
  sequenceLength
}) {
  const annLen = getRangeLength({ start, end }, sequenceLength);
  let basesToUse = bases;
  if (bases.length < annLen) {
    if (forward && primerBindsOn === "3prime") {
      const toAddLen = annLen - bases.length;
      for (let index = 0; index < toAddLen; index++) {
        basesToUse = "&" + basesToUse;
      }
    } else if (!forward && primerBindsOn === "5prime") {
      const toAddLen = annLen - bases.length;
      for (let index = 0; index < toAddLen; index++) {
        basesToUse = basesToUse + "&";
      }
    }
  }
  const aRange = {
    //tnr: this probably needs to be changed in case annotation wraps origin
    start: annotationRange.start - start,
    end: annotationRange.end - start
  };
  const r = {
    aRange,
    basesNoInserts: basesToUse,
    inserts: []
  };

  const baseLen = basesToUse.length;
  const diffLen = baseLen - annLen;
  if (diffLen > 0) {
    r.basesNoInserts = basesToUse.slice(
      primerBindsOn === "5prime" ? 0 : diffLen,
      primerBindsOn === "5prime" ? annLen : baseLen
    );
    const insertBases = basesToUse.slice(
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
    let seqForBase = (fullSequence && fullSequence[indexOfBase]) || "";
    if (!forward) {
      seqForBase = getComplementSequenceString(seqForBase);
    }
    const isMatch = seqForBase.toLowerCase() === b.toLowerCase();
    const isAmbiguousMatch =
      !isMatch &&
      ambiguous_dna_values[b.toUpperCase()].length > 1 &&
      ambiguous_dna_values[b.toUpperCase()].includes(seqForBase.toUpperCase());
    return {
      b,
      isMatch,
      isAmbiguousMatch
    };
  });
  r.allBasesWithMetaData = clone(r.basesNoInsertsWithMetaData);
  if (!forward) {
    r.allBasesWithMetaData = r.allBasesWithMetaData.reverse();
  }
  r.inserts
    .sort((a, b) => a.index - b.index)
    .forEach(({ bases, index }) => {
      r.allBasesWithMetaData.splice(
        index,
        0,
        ...bases.split("").map((b) => ({ b, isMatch: false }))
      );
    });

  return r;
}
