import React, { PropTypes } from 'react';
export default function StyleOrf({children, color, annotation, signals}) {
    return (
        <g
          onClick={ function (e) {
            e.stopPropagation()
            signals.orfClicked({annotation: annotation}) 
            }
          }
          strokeWidth="1"
          stroke={ color || 'orange'}
          fillOpacity={ 1 }
          fill={ color || 'orange' }>
          { children }
        </g>)
}

StyleOrf.propTypes = {
    color: PropTypes.string.isRequired,
    signals: PropTypes.shape({
      orfClicked: PropTypes.func.isRequired
    }),
    annotation: PropTypes.object.isRequired,
    children: PropTypes.element
}