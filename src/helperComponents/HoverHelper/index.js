import classnames from "classnames";
import deepEqual from "deep-equal";
import { mouseAware } from "react-mouse-aware";
import './style.css';
import * as hoveredAnnotationActions from '../../redux/hoveredAnnotation';
import { connect } from "react-redux";
import React from "react";

class HoverHelper extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (deepEqual(nextProps, this.props)) {
      return false;
    } else {
      return true;
    }
  }
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
      onHover = noop,
      meta,
      doNotTriggerOnMouseOut,
      passJustOnMouseOverAndClassname
      // ...rest
    } = this.props;

    let { className = "" } = (children && children.props) || {};
    let mouseAway = doNotTriggerOnMouseOut
      ? noop
      : function(e) {
          hoveredAnnotationClear(idToPass, meta);
          e.stopPropagation();
        };
    let props = {
      className: classnames(className, "hoverHelper", {
        veAnnotationHovered: hovered,
        doNotTriggerOnMouseOut
      }),
      onMouseOver: function(e) {
        e.stopPropagation();
        hoveredAnnotationUpdate(idToPass, meta);
        onHover({ e, idToPass, meta });
      },
      onMouseLeave: mouseAway
    };
    let extraProps = {
      hovered,
      hoveredId
    };
    let propsToPass = passJustOnMouseOverAndClassname
      ? props
      : { ...props, ...extraProps };
    if (typeof children === "function") {
      return React.cloneElement(children(propsToPass), propsToPass);
    } else {
      return React.cloneElement(children, propsToPass);
    }
  }
}

let WrappedHoverHelper = connect(function(state, { id, meta }) {
  let editorState = state.VectorEditor[meta.editorName] || {};
  let isIdHashmap = typeof id === "object";
  let hoveredId = editorState.hoveredAnnotation;
  let hovered = isIdHashmap ? id[hoveredId] : hoveredId === id;
  let idToPass = isIdHashmap ? Object.keys(id)[0] : id;
  return {
    hovered,
    id,
    hoveredId: hovered ? hoveredId : "", //only pass the hoveredId in if the component is actually interested in it to prevent unecessary renders
    isIdHashmap,
    idToPass
  };
}, hoveredAnnotationActions)(mouseAware()(HoverHelper));
export default WrappedHoverHelper;

function noop() {}
