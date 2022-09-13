export function getPairwiseOverviewLinearViewOptions({ isTemplate }) {
  if (!isTemplate) {
    return {
      annotationVisibilityOverrides: {
        features: false,
        translations: false,
        parts: false,
        orfs: false,
        orfTranslations: false,
        cdsFeatureTranslations: false,
        axis: false,
        cutsites: false,
        primers: false,
        chromatogram: false,
        sequence: false,
        dnaColors: false,
        reverseSequence: false,
        axisNumbers: false
      }
    };
  } else {
    return {
      // annotationVisibilityOverrides: {
      //   features: false,
      //   yellowAxis: false,
      //   translations: false,
      //   parts: false,
      //   orfs: false,
      //   orfTranslations: false,
      //   axis: true,
      //   cutsites: false,
      //   primers: false,
      //   reverseSequence: false,
      //   axisNumbers: false
      // }
    };
  }
}
