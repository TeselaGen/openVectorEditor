import { withHandlers, branch } from "recompose";
import { annotationTypes } from "ve-sequence-utils";


export default compose(
  withHandlers({
    onMouseOver: (props) => (e) => {
      const { id, hoveredAnnotationUpdate } = props;
      const isIdHashmap = typeof id === "object";
      const idToPass = isIdHashmap ? Object.keys(id)[0] : id;
      const annot = props?.annotation || props?.label?.annotation;
      if (
        annotationTypes.modifiableTypes.includes(annot?.annotationTypePlural)
      ) {
        props.ed.hoveredAnnotation.annotation = annot;
      }
      //because the calling onHover can slow things down, we disable it if dragging or scrolling
      if (window.__veDragging || window.__veScrolling) return;
      e.stopPropagation(); //this is important otherwise hovering labels inside circular view label groups won't work
      hoveredAnnotationUpdate &&
        hoveredAnnotationUpdate(idToPass);
    },
    onMouseLeave: (props) => (e) => {
      props.ed.hoveredAnnotation.annotation = undefined;
      const { hoveredAnnotationClear } = props;
      e.stopPropagation();
      if (window.__veDragging || window.__veScrolling) return;
      hoveredAnnotationClear && hoveredAnnotationClear(true);
    }
  })
);
