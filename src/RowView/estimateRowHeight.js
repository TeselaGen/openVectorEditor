import { forEach } from "lodash";

const annotationsToCompute = {
  primaryProteinSequence: {
    fixedHeight: 19
  },
  translations: {
    annotationHeight: 19,
    hasYOffset: true
  },
  parts: {
    annotationHeight: 19,
    hasYOffset: true
  },
  primers: {
    annotationHeight: 21,
    hasYOffset: true
  },
  cutsites: {
    annotationHeight: 15,
    hasYOffset: false
  },
  features: {
    annotationHeight: 21,
    margin: 10,
    hasYOffset: true
  },
  orfs: {
    annotationHeight: 19,
    hasYOffset: true
  },
  sequence: {
    fixedHeight: 16,
    isAlwaysShown: true
  },
  reverseSequence: {
    fixedHeight: 16
  },
  axis: {
    fixedHeight: 19.79
  },
  cutsiteLabels: {
    // computeHeight: getCutsiteLabelHeights, //tnr: not actually that necessary
    type: "cutsites",
    annotationHeight: 15,
    hasYOffset: true,
    isLabel: true
  }
};

export default ({
  index,
  cache,
  clearCache,
  row,
  annotationVisibility,
  annotationLabelVisibility
}) => {
  if (clearCache) {
    cache = {};
  }

  if (cache[index]) {
    return cache[index];
  }
  let height = 10; //account for spacer
  if (!row) return 0;
  forEach(annotationsToCompute, (
    {
      fixedHeight,
      margin = 0,
      isLabel,
      isAlwaysShown,
      annotationHeight,
      // computeHeight,
      hasYOffset,
      type
    },
    key
    // i
  ) => {
    const isShown =
      isAlwaysShown ||
      (isLabel
        ? annotationLabelVisibility[type] && annotationVisibility[key]
        : annotationVisibility[key]);
    if (!isShown) return;
    if (fixedHeight) return (height += fixedHeight);
    const annotations = row[type || key];
    if (hasYOffset) {
      let maxYOffset = 0;
      annotations.forEach(a => {
        if (a.yOffset + 1 > maxYOffset) maxYOffset = a.yOffset + 1;
      });
      height += maxYOffset * annotationHeight;
      if (maxYOffset > 0) height += margin;
    }
  });
  cache[index] = height;
  return height;
};
