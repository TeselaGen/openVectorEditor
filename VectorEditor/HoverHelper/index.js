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
        var {hovered, idToPass, hoveredId, mouseAware, isOver, children, hoveredAnnotationUpdate, onAnnotationMouseout, namespace, ...rest} = this.props
        
        var props = {
            className: children.props.className + ' hoverHelper ' + (hovered ? ' veAnnotationHovered' : ''),
            onMouseOver: function(e) {
                // e.preventDefault()
                e.stopPropagation()
                hoveredAnnotationUpdate(idToPass, namespace)
            },
            // onMouseOut: function(e) {
            //     // e.preventDefault()
            //     e.stopPropagation()
            //     onAnnotationMouseout(idToPass, namespace)
            // },
            hovered: hovered,
            hoveredId,
            ...rest
        }
        return React.cloneElement(children, props)
    }
}

var WrappedHoverHelper = connect(function (state, {id, namespace}) {
    var editorState = state.VectorEditor[namespace]
    var isIdHashmap = typeof id === 'object' 
    var hoveredId = editorState.hoveredAnnotation
    var hovered = isIdHashmap
        ? id[hoveredId]
        : (hoveredId===id)
    var idToPass = isIdHashmap
        ? (Object.keys(id)[0])
        : id
    // if (idToPass === undefined) debugger;
  return {hovered, id, 
    hoveredId: hovered ? hoveredId : '', //only pass the hoveredId in if the component is actually interested in it to prevent unecessary renders
    isIdHashmap, idToPass}
}, hoveredAnnotationActions)(mouseAware()(HoverHelper))

export default WrappedHoverHelper
