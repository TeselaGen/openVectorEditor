import forEach from 'lodash/collection/forEach'
import React, { PropTypes } from 'react';

let getXStartAndWidthOfRowAnnotation = require('../../../shared-utils/getXStartAndWidthOfRowAnnotation');
let getAnnotationRangeType = require('ve-range-utils/getAnnotationRangeType');
let Feature = require('./Feature');

let AnnotationContainerHolder = require('../AnnotationContainerHolder');
let AnnotationPositioner = require('../AnnotationPositioner');

let Features = React.createClass({

    render: function() {
        var {
            annotationRanges=[],
            bpsPerRow,
            charWidth,
            annotationHeight,
            spaceBetweenAnnotations
        } = this.props;

        if (annotationRanges.length === 0) {
            return null;
        }
        let maxAnnotationYOffset = 0;
        let annotationsSVG = [];
        annotationHeight = annotationHeight*6;
        forEach(annotationRanges, function(annotationRange, index) {
            if (annotationRange.yOffset > maxAnnotationYOffset) {
                maxAnnotationYOffset = annotationRange.yOffset;
            }
            let annotation = annotationRange.annotation;
            let result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);

            annotationsSVG.push(
                <div
                    key={'feature' + index}
                    id={annotation.id}
                    >
                    <div>
                        <AnnotationPositioner
                            height={annotationHeight}
                            width={result.width}
                            key={index}
                            top= {annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
                            left={-result.xStart}
                            >
                            <Feature
                                key={index}
                                annotation={annotation}
                                color={annotation.color}
                                forward={annotation.forward}
                                rangeType={getAnnotationRangeType(annotationRange, annotation, annotation.forward)}
                                height={annotationHeight}
                                name={annotation.name}
                                annotationRange={annotationRange}
                                >
                            </Feature>
                        </AnnotationPositioner>
                    </div>
                </div>
            );
        });
        let containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
        return (
            <AnnotationContainerHolder
                className='Features'
                containerHeight={containerHeight}
                >
                {annotationsSVG}
            </AnnotationContainerHolder>
        );
    }
});

module.exports = Features;
