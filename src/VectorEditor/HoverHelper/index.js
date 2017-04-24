import classnames from 'classnames'
import deepEqual from 'deep-equal';
import {mouseAware} from 'react-mouse-aware';
import './style';
import * as hoveredAnnotationActions from '../redux/hoveredAnnotation';
import {connect} from 'react-redux';
import React from 'react';

class HoverHelper extends React.Component { 
    shouldComponentUpdate(nextProps) {
        if (deepEqual(nextProps, this.props)) {
            return false
        } else {
            return true
        }
    }
    render () {
        var {hovered, 
            idToPass, 
            hoveredId, 
            mouseAware, 
            isOver, 
            children, 
            hoveredAnnotationUpdate, 
            hoveredAnnotationClear, 
            onHover=noop,
            meta, 
            doNotTriggerOnMouseOut,
            passJustOnMouseOverAndClassname,
            // ...rest
        } = this.props
        
        var {className=''} = (children && children.props) || {}
        var mouseAway = doNotTriggerOnMouseOut ? noop : function(e) {
                        hoveredAnnotationClear(idToPass, meta)
                        e.stopPropagation()
                    }
        var props = {
            className: classnames(className, 'hoverHelper', 
              {
                veAnnotationHovered: hovered,
                doNotTriggerOnMouseOut,
              }
            ),
            onMouseOver: function(e) {
                e.stopPropagation()
                hoveredAnnotationUpdate(idToPass, meta)
                onHover({e, idToPass, meta})
            },
            onMouseLeave: mouseAway,
        }
        var extraProps = {
          hovered: hovered,
          hoveredId,
        }
        var propsToPass = passJustOnMouseOverAndClassname
        ? props 
        : {...props, ...extraProps}
        if (typeof children === 'function') {
            return React.cloneElement(children(propsToPass), propsToPass)
        } else {
            return React.cloneElement(children, propsToPass)
        }
    }
}


var WrappedHoverHelper = connect(function (state, {id, meta}) {
    var editorState = state.VectorEditor[meta.namespace] || {}
    var isIdHashmap = typeof id === 'object' 
    var hoveredId = editorState.hoveredAnnotation
    var hovered = isIdHashmap
        ? id[hoveredId]
        : (hoveredId===id)
    var idToPass = isIdHashmap
        ? (Object.keys(id)[0])
        : id
  return {
    hovered, 
    id, 
    hoveredId: hovered ? hoveredId : '', //only pass the hoveredId in if the component is actually interested in it to prevent unecessary renders
    isIdHashmap, 
    idToPass
  }
}, hoveredAnnotationActions)(
  mouseAware()(HoverHelper)
)
export default WrappedHoverHelper

function noop() {}
