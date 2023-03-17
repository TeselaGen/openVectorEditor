import { map } from "lodash";

export function truncateOriginSpanningAnnotations(ed) {
  const {
    features = [],
    parts = [],
    translations = [],
    primers = [],
    sequenceLength
  } = ed;

  ed.features = truncateOriginSpanners(features, sequenceLength);
  ed.parts = truncateOriginSpanners(parts, sequenceLength);
  ed.translations = truncateOriginSpanners(translations, sequenceLength);
  ed.primers = truncateOriginSpanners(primers, sequenceLength);
}

function truncateOriginSpanners(annotations, sequenceLength) {
  return map(annotations, (annotation) => {
    const { start = 0, end = 0 } = annotation;
    if (start > end) {
      return {
        ...annotation,
        end: sequenceLength - 1
      };
    } else {
      return annotation;
    }
  });
}

export function hasAnnotationThatSpansOrigin({
  features = [],
  parts = [],
  translations = [],
  primers = []
}) {
  return (
    doAnySpanOrigin(features) ||
    doAnySpanOrigin(parts) ||
    doAnySpanOrigin(translations) ||
    doAnySpanOrigin(primers)
  );
}
function doAnySpanOrigin(annotations) {
  return some(annotations, ({ start = 0, end = 0 }) => {
    if (start > end) return true;
  });
}
