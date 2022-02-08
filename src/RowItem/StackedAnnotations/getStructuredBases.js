import { getRangeLength } from "ve-range-utils";

export function getStructuredBases({
  bases,
  start,
  end,
  primerBindsOn,
  sequenceLength
}) {
  const r = {
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
  return r;
}
