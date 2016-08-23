import React from 'react';
import Draggable from 'react-draggable';
import { Decorator as Cerebral } from 'cerebral-view-react';

var Feature = React.createClass({

    render: function() {
        var {
            widthInBps, 
            charWidth, 
            height, 
            rangeType, 
            forward, 
            name,
            pointiness=8,
            fontWidth=12, 
            color, 
            featureClicked,
            annotation,
            signals
        } = this.props;

        var width = widthInBps * charWidth;
        var charWN = charWidth; //charWN is normalized
        if (charWidth < 15) { //allow the arrow width to adapt
            if (width > 15) {
                charWN = 15; //tnr: replace 15 here with a non-hardcoded number..
            } else {
                charWN = width;
            }
        }
        var widthMinusOne = width - charWN;
        var path;
        // starting from the top left of the feature
        if (rangeType === 'middle') {
            //draw a rectangle
            path = `
            M 0,0 
            L ${width-pointiness/2},0
            Q ${width + pointiness/2},${height/2} ${width-pointiness/2},${height}
            L ${0},${height}
            Q ${pointiness},${height/2} ${0},${0}
            z`;
        } else if (rangeType === 'start') {
            path = `
            M 0,0 
            L ${width-pointiness/2},0 
            Q ${width + pointiness/2},${height/2} ${width-pointiness/2},${height}
            L 0,${height} 
            z`
        } else if (rangeType ==='beginningAndEnd') {
            path = `
            M 0,0 
            L ${widthMinusOne},0 
            L ${width},${height/2} 
            L ${widthMinusOne},${height} 
            L 0,${height} 
            z`
        } else {
          path = `
          M 0,0 
          L ${widthMinusOne},0 
          L ${width},${height/2} 
          L ${widthMinusOne},${height} 
          L 0,${height} 
          Q ${pointiness},${height/2} ${0},${0}
          z`
        }
        return (
            <g
                className='veRowViewFeature clickable'
                onClick={ function (e) {
                    e.stopPropagation()
                    signals.featureClicked({annotation: annotation}) 
                }}
                >
                <path
                    strokeWidth="1"
                    stroke={ 'black' }
                    fill={ color }
                    transform={ forward ? null : "translate(" + width + ",0) scale(-1,1) " }
                    d={ path }
                    />
            </g>
        );
    }
});
module.exports = Feature;
