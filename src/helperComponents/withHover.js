import classnames from "classnames";
import { compose } from "redux";
import { connect } from "react-redux";
import React from "react";
import * as hoveredAnnotationActions from "../redux/hoveredAnnotation";

function withHover(Component) {
  return class HoverHelper extends React.Component {
    // shouldComponentUpdate(nextProps) {
    //   if (deepEqual(nextProps, this.props)) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }

    render() {
      let {
        hovered,
        idToPass,
        hoveredId,
        mouseAware,
        isOver,
        children,
        hoveredAnnotationUpdate,
        hoveredAnnotationClear,
        onHover,
        className,
        editorName,
        isLabelGroup,
        isSubLabel,
        doNotTriggerOnMouseOut,
        passJustOnMouseOverAndClassname,
        ...rest
      } = this.props;
      /* eslint-disable */
      if (!idToPass) debugger;
      /* eslint-enable */

      let mouseAway = doNotTriggerOnMouseOut
        ? noop
        : e => {
            e.stopPropagation();
            if (window.__veDragging || window.__veScrolling) return;
            hoveredAnnotationClear(true, { editorName });
          };
      let hoverActions = {
        onMouseOver: e => {
          //because the calling onHover can slow things down, we disable it if dragging or scrolling
          if (window.__veDragging || window.__veScrolling) return;
          e.stopPropagation();
          hoveredAnnotationUpdate(idToPass, { editorName });
          onHover && onHover({ e, idToPass, meta: { editorName } });
        },
        onMouseLeave: mouseAway
      };
      let hoverProps = {
        hovered,
        hoveredId,
        className: classnames(className, "hoverHelper", {
          veAnnotationHovered: hovered,
          doNotTriggerOnMouseOut
        })
      };

      // let extraProps = {
      //   hovered,
      //   hoveredId
      // };
      // let propsToPass = passJustOnMouseOverAndClassname
      //   ? props
      //   : { ...props, ...extraProps };
      return <Component {...{ ...rest, hoverActions, hoverProps }} />;
    }
  };
}

export default compose(
  connect(function(
    state,
    {
      id,
      editorName = "StandaloneEditor",
      annotation,
      isHovered,
      passHoveredId
    }
  ) {
    let editorState = state.VectorEditor[editorName] || {};
    let isIdHashmap = typeof id === "object";
    let hoveredId = editorState.hoveredAnnotation;
    let hovered =
      (annotation && annotation.isHovered) || isHovered || isIdHashmap
        ? id[hoveredId]
        : hoveredId === id;
    let idToPass = isIdHashmap ? Object.keys(id)[0] : id;
    /* eslint-disable */

    // if (!idToPass) debugger;
    /* eslint-enable */

    return {
      hovered,
      id,
      // hoveredId: hovered ? hoveredId : "" ,
      ...(passHoveredId && { hoveredId: hovered ? hoveredId : "" }), //only pass the hoveredId in if the component is actually interested in it to prevent unecessary renders
      isIdHashmap,
      idToPass
    };
  },
  hoveredAnnotationActions),
  withHover
);

// export default function FakeHoverHelper({children}) {
//     return children
// }

function noop() {}
