import React, { PropTypes } from 'react';
export default function StyleFeature({children, color, annotation}) {
    return (
        <g
          className='ve-feature'
          strokeWidth="1"
          stroke={ color || 'gray'}
          // fillOpacity={ 0.4 }
          fill={ color || 'gray' }>
          { children }
        </g>)
}

StyleFeature.propTypes = {
    color: PropTypes.string.isRequired,
    annotation: PropTypes.object.isRequired,
    children: PropTypes.element
}