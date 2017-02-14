import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

@Cerebral({
    annotationHeight: ['annotationHeight'],
    bpsPerRow: ['bpsPerRow'],  
    charWidth: ['charWidth'], 
    rowData: ['rowData'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations']     
})

export default class Feature extends React.Component {

    render() {
        var {
            bpsPerRow,
            charWidth, 
            height, 
            rangeType, 
            forward, 
            pointiness=4,
            fontWidth=16, 
            color, 
            name,
            // featureClicked,
            annotation,
            signals,
            widthInBps
        } = this.props;

        height = 20; // {{}} should this not be hardcoded

        var width = widthInBps * (charWidth * 1.2) - 20;
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

        var nameToDisplay = name
        var textLength = name.length * fontWidth
        var textOffset = (widthMinusOne/2)
        if (textLength > widthMinusOne) {
            textOffset = 0
            nameToDisplay = ''
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
                    fill={ color }
                    transform={ forward ? null : "translate(" + width + ",0) scale(-1,1) " }
                    d={ path }
                    />
                <text style={{fill: 'black'}} transform={`translate(${textOffset},${height*.75})`}>
                    { nameToDisplay }
                </text>
            </g>
        );
    }
}