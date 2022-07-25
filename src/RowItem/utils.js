import { ANNOTATION_LABEL_FONT_WIDTH } from "./constants";
import { getWidth } from "./getXStartAndWidthOfRowAnnotation";

export const doesLabelFitInAnnotation = (
  text = "",
  { range, width },
  charWidth
) => {
  const textLength = text.length * ANNOTATION_LABEL_FONT_WIDTH;
  const widthMinusOne =
    (range ? getWidth(range, charWidth, 0) : width) - charWidth;
  return widthMinusOne > textLength;
};

// export const getTruncatedLabel = (
//   text = "",
//   widthInBps,
// ) => {
//   const textLength = text.length * ANNOTATION_LABEL_FONT_WIDTH;
//   const widthMinusOne =
//     (range ? getWidth(range, charWidth, 0) : width) - charWidth;
//   const doesFit = widthMinusOne > textLength;
//   if (returnTextThatFits) {
//     if (doesFit) {
//       return text;
//     } else {
//       return text.slice(0, widthMinusOne);
//     }
//   } else {
//     return doesFit;
//   }
// };
