import { forEach } from "lodash";

const debug = 0;
// const debug = console.log("comment me back out!") || 1;

export const rowHeights = {
  rowJumpButtons: { height: 30 },
  spacer: { height: 10 },
  aminoAcidNumbers: { height: 9 },
  translations: { spaceBetweenAnnotations: 2, marginTop: 5, height: 17 },
  chromatogram: { height: 134 },
  parts: { spaceBetweenAnnotations: 2, marginTop: 5, height: 15 },
  primers: { spaceBetweenAnnotations: 2, marginTop: 5, height: 18 },
  features: { spaceBetweenAnnotations: 2, marginTop: 5, height: 15 },
  warnings: { spaceBetweenAnnotations: 2, marginTop: 5, height: 15 },
  assemblyPieces: { spaceBetweenAnnotations: 2, marginTop: 5, height: 15 },
  lineageAnnotations: { spaceBetweenAnnotations: 2, marginTop: 5, height: 15 },
  orfs: { spaceBetweenAnnotations: 2, marginTop: 5, height: 15 },
  //tnrtodo -- we should estimate external label height for parts/features/primers
  cutsiteLabels: { spaceBetweenAnnotations: 0, height: 15 },
  sequence: { height: 15 },
  reverseSequence: { height: 15 },
  axis: { marginTop: 5, height: 15 }
};

rowHeights.primaryProteinSequence = rowHeights.translations;

Object.keys(rowHeights).forEach((k) => {
  rowHeights[k].type = k;
  rowHeights[k].marginTop = rowHeights[k].marginTop || 0;
  rowHeights[k].marginBottom = rowHeights[k].marginBottom || 0;
  rowHeights[k].spaceBetweenAnnotations =
    rowHeights[k].spaceBetweenAnnotations || 0;
});
const translations = {
  getHeight: (props) => {
    if (props.annotationVisibility.aminoAcidNumbers) {
      return [rowHeights.aminoAcidNumbers.type, rowHeights.translations.type];
    }
    return rowHeights.translations.type;
  },
  hasYOffset: true
};

const annotationsToCompute = {
  spacer: {
    alwaysVisible: true,
    height: rowHeights.spacer.type
  },
  primaryProteinSequence: translations,
  translations,
  parts: {
    height: rowHeights.parts.type,
    hasYOffset: true
  },
  primers: {
    height: rowHeights.primers.type,
    hasYOffset: true
  },
  features: {
    height: rowHeights.features.type,
    hasYOffset: true
  },
  chromatogram: {
    height: rowHeights.chromatogram.type
  },
  warnings: {
    height: rowHeights.warnings.type,
    hasYOffset: true
  },
  orfs: {
    height: rowHeights.orfs.type,
    hasYOffset: true
  },
  sequence: {
    height: rowHeights.sequence.type
  },
  reverseSequence: {
    height: rowHeights.reverseSequence.type
  },
  axis: {
    height: rowHeights.axis.type
  },
  cutsiteLabels: {
    typeOverride: "cutsites",
    height: rowHeights.cutsiteLabels.type,
    hasYOffset: true
  }
};

export default (props) => {
  let {
    index,
    cache,
    clearCache,
    chromatogramData,
    rowCount,
    row,
    showJumpButtons,
    annotationVisibility
  } = props;
  if (clearCache) {
    cache = {};
  }

  if (cache[index]) {
    return cache[index];
  }
  if (!row) return 0;
  let totalHeight = 0; //account for spacer
  if (showJumpButtons && (index === 0 || index === rowCount - 1)) {
    totalHeight += rowHeights.rowJumpButtons.height;
  }
  forEach(
    annotationsToCompute,
    (
      { height: _height, alwaysVisible, getHeight, hasYOffset, typeOverride },
      key
    ) => {
      const shouldShow =
        alwaysVisible || annotationVisibility[typeOverride || key];
      if (!shouldShow) return;
      if (key === "chromatogram" && !chromatogramData) return;
      const heightKeys = getHeight ? getHeight(props) : _height;
      const [annotationHeight, marginHeight] = getSummedHeights(
        heightKeys,
        props
      );

      let heightToAdd = annotationHeight;
      if (hasYOffset) {
        const annotations = row[typeOverride || key];
        if (hasYOffset) {
          let maxYOffset = 0;
          annotations &&
            annotations.forEach((a) => {
              if (a.yOffset + 1 > maxYOffset) maxYOffset = a.yOffset + 1;
            });
          heightToAdd = maxYOffset * annotationHeight;
        }
      }
      if (heightToAdd > 0) heightToAdd += marginHeight;

      if (debug) {
        heightToAdd !== 0 &&
          console.info(`heightToAdd, key:`, heightToAdd, key);
      }
      totalHeight += heightToAdd;
    }
  );
  if (debug) {
    console.info(`totalHeight:`, totalHeight);
  }
  if (annotationVisibility.compactNames) {
    totalHeight = Math.max(totalHeight, 31);
  }
  cache[index] = totalHeight;
  return totalHeight;
};

function getHeights(heightKey, props) {
  const annotationHeight = !heightKey
    ? 0
    : props[heightKey + "Height"] || (rowHeights[heightKey] || {}).height || 0;

  const marginHeight =
    (props[heightKey + "MarginTop"] ||
      (rowHeights[heightKey] || {}).marginTop ||
      0) +
    (props[heightKey + "MarginBottom"] ||
      (rowHeights[heightKey] || {}).marginBottom ||
      0);
  return [annotationHeight, marginHeight];
}
function getSummedHeights(heightKeys, props) {
  let height = 0;
  let marginHeight = 0;
  (Array.isArray(heightKeys) ? heightKeys : [heightKeys]).forEach((k) => {
    const [h, m] = getHeights(k, props);
    height += h;
    marginHeight += m;
  });
  return [height, marginHeight];
}
