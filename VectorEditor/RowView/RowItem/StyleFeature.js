import React, { PropTypes } from 'react';
export default function StyleFeature({children, color}) {
    return (
        <g
          strokeWidth="1"
          stroke={ color || 'orange'}
          fillOpacity={ 0.4 }
          fill={ color || 'orange' }>
          { children }
        </g>)
}

StyleFeature.propTypes = {
    color: PropTypes.string.isRequired,
    annotation: PropTypes.object.isRequired,
    children: PropTypes.element
}