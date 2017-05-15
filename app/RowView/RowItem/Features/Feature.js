import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import getXStartAndWidthOfRowAnnotation from '../../../shared-utils/getXStartAndWidthOfRowAnnotation';
import colorOfFeature from '../../../constants/feature-colors';

@Cerebral({
    annotationHeight: ['annotationHeight'],
    bpsPerRow: ['bpsPerRow'],
    charWidth: ['charWidth'],
    rowData: ['rowData'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations']
})

export default class Feature extends React.Component {

    singleClick() {
        this.props.signals.featureClicked({ annotation: this.props.annotation });
    }

    doubleClick() {
        this.props.signals.featureClicked({ annotation: this.props.annotation });
        this.props.signals.sidebarToggle({ sidebar: true, annotation: this.props.annotation, view: "row" });
        this.props.signals.adjustWidth();
    }

    handleClick(e) {
        var clicks = 0;
        var timeout;

        return function() {
            clicks += 1;

            if (clicks === 1) {
                timeout = setTimeout(function() {
                    this.singleClick();
                    clicks = 0;
                }.bind(this), 250);

            } else {
                clearTimeout(timeout);
                this.doubleClick();
                clicks = 0;
            }
        }.bind(this)
    }

    render() {
        var {
            bpsPerRow,
            charWidth,
            height,
            rangeType,
            forward,
            pointiness=4,
            fontWidth=16,
            name,
            annotation,
            signals,
            annotationRange
        } = this.props;

        height = 20; // {{}} should this not be hardcoded

        let result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
        var width = result.width;

        var featureColor = colorOfFeature(annotation);
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
                onClick={this.handleClick()}
                >
                <path
                    fill={ featureColor }
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
