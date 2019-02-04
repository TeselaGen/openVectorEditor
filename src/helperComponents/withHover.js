import classnames from "classnames";
import { compose } from "redux";
import { connect } from "react-redux";
import React from "react";
import * as hoveredAnnotationActions from "../redux/hoveredAnnotation";
import { withHandlers } from "recompose";

export const HoveredIdContext = React.createContext({
  hoveredId: "" // default value
});

function withHoveredIdFromContext(Component) {
  return function HoveredIdComponent(props) {
    return (
      <HoveredIdContext.Consumer>
        {contexts => <Component {...props} {...contexts} />}
      </HoveredIdContext.Consumer>
    );
  };
}

export default compose(
  withHoveredIdFromContext,
  connect(
    function(
      state,
      {
        id,
        editorName = "StandaloneEditor",
        className,
        hoveredId: hoveredIdFromContext,
        passHoveredId
      }
    ) {
      if (!editorName) {
        console.warn(
          "please pass an editorName to the withHover() wrapped component"
        );
      }
      let editorState = state.VectorEditor[editorName] || {};
      let hoveredId = editorState.hoveredAnnotation || hoveredIdFromContext; //we can pass a hoveredId from context in order to still use the hover functionality without being connected to redux! see http://localhost:3344/#/SimpleCircularOrLinearView for an example
      let isIdHashmap = typeof id === "object";

      let hovered = !!(isIdHashmap ? id[hoveredId] : hoveredId === id);
      const newClassName = classnames(className, "hoverHelper", {
        veAnnotationHovered: hovered
      });
      const toReturn = {
        hovered,
        className: newClassName
      };
      if (hovered && passHoveredId) {
        //only pass hoveredId if it is hovered
        toReturn.hoveredId = hoveredId;
      }
      return toReturn;
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
