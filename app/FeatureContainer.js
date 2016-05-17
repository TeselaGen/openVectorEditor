import StyleFeature from './StyleFeature';
import React, { PropTypes } from 'react';
import getXStartAndWidthOfRowAnnotation from './getXStartAndWidthOfRowAnnotation';
import getAnnotationRangeType from 've-range-utils/getAnnotationRangeType';
import LinearFeature from './LinearFeature';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import AnnotationContainerHolder from './AnnotationContainerHolder';
import AnnotationPositioner from './AnnotationPositioner';

let FeatureContainer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        annotationRanges: PropTypes.arrayOf(PropTypes.shape({
            start: PropTypes.number.isRequired,
            end: PropTypes.number.isRequired,
            yOffset: PropTypes.number.isRequired,
            annotation: PropTypes.shape({
                start: PropTypes.number.isRequired,
                end: PropTypes.number.isRequired,
                forward: PropTypes.bool.isRequired,
                id: PropTypes.string.isRequired
            })
        })),
        charWidth: PropTypes.number.isRequired,
        bpsPerRow: PropTypes.number.isRequired,
        annotationHeight: PropTypes.number.isRequired,
        spaceBetweenAnnotations: PropTypes.number.isRequired,
        sequenceLength: PropTypes.number.isRequired,
        signals: PropTypes.object.isRequired
    },
    render: function() {
        var {
            annotationRanges,
            bpsPerRow,
            charWidth,
            annotationHeight,
            spaceBetweenAnnotations, 
            signals
        } = this.props;

        if (annotationRanges.length === 0) {
            return null;
        }
        let maxAnnotationYOffset = 0;
        let annotationsSVG = [];
        annotationRanges.forEach(function(annotationRange, index) {
            if (annotationRange.yOffset > maxAnnotationYOffset) {
                maxAnnotationYOffset = annotationRange.yOffset;
            }
            let annotation = annotationRange.annotation;
            let result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
            annotationsSVG.push(
                <AnnotationPositioner 
                    height={annotationHeight} 
                    width={result.width}
                    key={index}
                    top= {annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
                    left={result.xStart}
                    >
                    <StyleFeature
                        signals={signals}
                        annotation={annotation}
                        color={annotation.color}>
                        <LinearFeature
                            widthInBps={annotationRange.end - annotationRange.start + 1}
                            charWidth={charWidth}
                            forward={annotation.forward}
                            rangeType={getAnnotationRangeType(annotationRange, annotation, annotation.forward)}
                            height={annotationHeight}
                            name={annotation.name}>
                        </LinearFeature>
                    </StyleFeature>
                    
                </AnnotationPositioner>
            );
        });
        let containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
        return (
            <AnnotationContainerHolder 
                className='featureContainer'
                containerHeight={containerHeight}>
                {annotationsSVG}
            </AnnotationContainerHolder>
        );

    }
});

module.exports = FeatureContainer;