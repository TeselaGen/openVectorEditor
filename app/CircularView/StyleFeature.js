import React from 'react';

export default function StyleFeature({children, color, annotation, signals}) {
    return (
        <g
            // onClick={ function (e) {
            //     e.stopPropagation()
            //     signals.featureClicked({ annotation: annotation })
            // }}
            // onDoubleClick={ function (e) {
            //     e.stopPropagation()
            //     signals.sidebarToggle({ sidebar: true, annotation: annotation, view: "circular" })
            // }}
            className='ve-feature'
            strokeWidth="1"
            stroke={ color || 'gray'}
            fill={ color || 'gray' }
            >
            { children }
        </g>
    )
}
