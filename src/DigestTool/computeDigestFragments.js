import { normalizePositionByRangeLength, getRangeLength } from "ve-range-utils";

export function computeDigestFragments({
  cutsites,
  computePartialDigest,
  computeDigestDisabled,
  sequenceLength,
  computePartialDigestDisabled,
  selectionLayerUpdate = () => {},
  updateSelectedFragment = () => {}
}) {
  const fragments = [];
  const overlappingEnzymes = [];
  const pairs = [];

  const sortedCutsites = cutsites.sort((a, b) => {
    return a.topSnipPosition - b.topSnipPosition;
  });
  sortedCutsites.forEach((cutsite1, index) => {
    if (computePartialDigest && !computePartialDigestDisabled) {
      sortedCutsites.forEach((cs, index2) => {
        if (index2 === index + 1 || index2 === 0) {
          return;
        }
        pairs.push([cutsite1, sortedCutsites[index2]]);
      });
    }
    if (!computeDigestDisabled) {
      pairs.push([
        cutsite1,
        sortedCutsites[index + 1]
          ? sortedCutsites[index + 1]
          : sortedCutsites[0]
      ]);
    }
  });

  pairs.forEach(([cut1, cut2]) => {
    const start = normalizePositionByRangeLength(
      cut1.topSnipPosition,
      sequenceLength
    );
    const end = normalizePositionByRangeLength(
      cut2.topSnipPosition - 1,
      sequenceLength
    );
    const size = getRangeLength({ start, end }, sequenceLength);

    // const id = uniqid()
    const id = start + "-" + end + "-" + size + "-";
    const name = `${cut1.restrictionEnzyme.name} -- ${cut2.restrictionEnzyme.name} ${size} bps`;
    getRangeLength({ start, end }, sequenceLength);
    fragments.push({
      cut1,
      cut2,
      start,
      end,
      size,
      id,
      name,
      onFragmentSelect: () => {
        selectionLayerUpdate({
          start,
          end,
          name
        });
        updateSelectedFragment(id);
      }
    });
  });
  fragments.filter((fragment) => {
    if (!fragment.size) {
      overlappingEnzymes.push(fragment);
      return false;
    }
    return true;
  });
  return {
    computePartialDigestDisabled,
    computeDigestDisabled,
    fragments,
    overlappingEnzymes
  };
}
