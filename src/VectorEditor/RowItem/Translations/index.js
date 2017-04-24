import './style.scss';
import React, { PropTypes } from 'react';
import getAnnotationRangeType from 've-range-utils/getAnnotationRangeType';
const AnnotationContainerHolder = require('../AnnotationContainerHolder');
const AnnotationPositioner = require('../AnnotationPositioner');
const Translation = require('./Translation');
const getXStartAndWidthOfRowAnnotation = require('../getXStartAndWidthOfRowAnnotation');

const PureRenderMixin = require('react-addons-pure-render-mixin');

const Translations = React.createClass({
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
    },
    render() {
        var {annotationRanges, bpsPerRow, charWidth, annotationHeight, spaceBetweenAnnotations, ...rest} = this.props;
        if (annotationRanges.length === 0) {
            return null;
        }
        let maxAnnotationYOffset = 0;
        const annotationsSVG = [];
        annotationRanges.forEach(function(annotationRange) {
            if (annotationRange.yOffset > maxAnnotationYOffset) { //TODO: consider abstracting out the code to calculate the necessary height for the annotation container
                maxAnnotationYOffset = annotationRange.yOffset;
            }
            const annotation = annotationRange.annotation;
            const result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
            annotationsSVG.push(
                <AnnotationPositioner 
                  height={annotationHeight} 
                  width={result.width}
                  className={'veRowViewTranslations'} 
                  key={'feature' + annotation.id + 'start:' + annotationRange.start}
                  top= {annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
                  left={result.xStart}
                  >
                    <Translation
                        annotationRange={annotationRange}
                        rangeType={getAnnotationRangeType(annotationRange, annotation, annotation.forward)}
                        widthInBps={annotationRange.end - annotationRange.start + 1}
                        charWidth={charWidth}
                        height={annotationHeight}
                        {...rest}
                        >
                    </Translation>
                </AnnotationPositioner>
            );
            // transform={"scale(" + transformX + ",.2) "}
            // annotationsSVG = annotationsSVG.concat(translationSVG);
        });
        const containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
          // height={containerHeight}
        return (
              <AnnotationContainerHolder 
                containerHeight={containerHeight}>
                {annotationsSVG}
              </AnnotationContainerHolder>
          );
    }
});
module.exports = Translations;
