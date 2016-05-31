import React, { PropTypes } from 'react';

export default function StyleFeature({children, color, annotation, signals}) {
    return (
        <g
            onClick={ function (e) {
                e.stopPropagation()
                signals.featureClicked({annotation: annotation}) 
            }}
            className='ve-feature'
            strokeWidth="1"
            stroke={ color || 'gray'}
            fill={ color || 'gray' }>
            { children }
        </g>
    )
}