let React = require('react');
let getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
let getAnnotationRangeType = require('ve-range-utils/getAnnotationRangeType');
let Feature = require('./Feature');
let PureRenderMixin = require('react/addons').addons.PureRenderMixin;

let AnnotationContainerHolder = require('./AnnotationContainerHolder');
let AnnotationPositioner = require('./AnnotationPositioner');

import {Component} from 'cerebral-react';

let FeatureContainer = Component({
    charWidth: ['charWidth'],
    bpsPerRow: ['bpsPerRow'],
    annotationHeight: ['annotationHeight'],
    sequenceLength: ['sequenceLength'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations'],
  }, {
    mixins: [PureRenderMixin],
    propTypes: {
        annotationRanges: React.PropTypes.array.isRequired,
        bpsPerRow: React.PropTypes.number.isRequired,
        charWidth: React.PropTypes.number.isRequired,
        annotationHeight: React.PropTypes.number.isRequired,
        spaceBetweenAnnotations: React.PropTypes.number.isRequired,
        setSelectionLayer: React.PropTypes.func.isRequired,
    },
    render: function() {
        var {
            annotationRanges,
            bpsPerRow,
            charWidth,
            annotationHeight,
            spaceBetweenAnnotations, 
            setSelectionLayer
        } = this.props;

        if (annotationRanges.length === 0) {
            return null;
        }
        let maxAnnotationYOffset = 0;
        let annotationsSVG = [];
        annotationRanges.forEach(function(annotationRange) {
            if (annotationRange.yOffset > maxAnnotationYOffset) {
                maxAnnotationYOffset = annotationRange.yOffset;
            }
            let annotation = annotationRange.annotation;
            let result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
            annotationsSVG.push(
                <AnnotationPositioner 
                    height={annotationHeight} 
                    width={result.width}
                    key={'feature' + annotation.id + 'start:' + annotationRange.start}
                    top= {annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
                    left={result.xStart}
                    >
                    <Feature
                        onClick={function (event) {
                          setSelectionLayer(this);
                          event.stopPropagation();
                        }.bind(annotation)}
                        widthInBps={annotationRange.end - annotationRange.start + 1}
                        charWidth={charWidth}
                        forward={annotation.forward}
                        rangeType={getAnnotationRangeType(annotationRange, annotation, annotation.forward)}
                        height={annotationHeight}
                        color={annotation.color}
                        name={annotation.name}>
                    </Feature>
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