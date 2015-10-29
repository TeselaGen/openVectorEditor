import React, { PropTypes } from 'react';
export default function StyleFeature({children, onClick, color}) {
    return (
        <g
          onClick={ onClick }
          strokeWidth="1"
          stroke={ color || 'orange'}
          fillOpacity={ 0.4 }
          fill={ color || 'orange' }>
          { children }
        </g>)
}

StyleFeature.propTypes = {
    color: PropTypes.string.isRequired,
    onClick: PropTypes.string.isRequired,
    children: PropTypes.renderable
}