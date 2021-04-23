import { ANNOTATION_LABEL_FONT_WIDTH } from "./constants";
import { getWidth } from "./getXStartAndWidthOfRowAnnotation";

export const doesLabelFitInAnnotation = (
  text = "",
  { range, width },
  charWidth
) => {
  let textLength = text.length * ANNOTATION_LABEL_FONT_WIDTH;
  let widthMinusOne =
    (range ? getWidth(range, charWidth, 0) : width) - charWidth;
  return widthMinusOne > textLength;
};
