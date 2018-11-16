import classnames from "classnames";
import { compose } from "redux";
import { connect } from "react-redux";
import * as hoveredAnnotationActions from "../redux/hoveredAnnotation";
import { withHandlers } from "recompose";

export default compose(
  connect(
    function(state, { id, editorName = "StandaloneEditor", className }) {
      if (!editorName) {
        console.warn(
          "please pass an editorName to the withHover() wrapped component"
        );
      }
      let editorState = state.VectorEditor[editorName] || {};
      let hoveredId = editorState.hoveredAnnotation;
      let isIdHashmap = typeof id === "object";

      let hovered = !!(isIdHashmap ? id[hoveredId] : hoveredId === id);
      const newClassName = classnames(className, "hoverHelper", {
        veAnnotationHovered: hovered
      });
      return {
        hovered,
        className: newClassName
      };
    },
    hoveredAnnotationActions
  ),
  withHandlers({
    onMouseOver: props => e => {
      const { editorName, id, hoveredAnnotationUpdate } = props;
      let isIdHashmap = typeof id === "object";
      let idToPass = isIdHashmap ? Object.keys(id)[0] : id;
      //because the calling onHover can slow things down, we disable it if dragging or scrolling
      if (window.__veDragging || window.__veScrolling) return;
      e.stopPropagation();
      hoveredAnnotationUpdate(idToPass, { editorName });
    },
    onMouseLeave: props => e => {
      const { editorName, hoveredAnnotationClear } = props;
      e.stopPropagation();
      if (window.__veDragging || window.__veScrolling) return;
      hoveredAnnotationClear(true, { editorName });
    }
  })
);
