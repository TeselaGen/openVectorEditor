let React = require('react');
let getXStartAndWidthOfRowAnnotation = require('../../../shared-utils/getXStartAndWidthOfRowAnnotation');
let getAnnotationRangeType = require('ve-range-utils/getAnnotationRangeType');
let Orf = require('./Orf');
let AnnotationContainerHolder = require('../AnnotationContainerHolder');
let AnnotationPositioner = require('../AnnotationPositioner');

let Orfs = React.createClass({

    render: function() {
        var {
            annotationRanges,
            bpsPerRow,
            charWidth,
            annotationHeight,
            spaceBetweenAnnotations,
            widthInBps,
            row,
            signals
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
            let {annotation} = annotationRange;
            var {internalStartCodonIndices=[]} = annotation
            var normalizedInternalStartCodonIndices = internalStartCodonIndices.filter(function (position) {
                if (position >= row.start && position <=row.end)
                return true
                }).map(function (position) {
                    return position - row.start;
                }
            )

            let result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
            var arrowHeight = 12;

            annotationsSVG.push(
                <AnnotationPositioner
                    className={'veRowViewOrfs'}
                    height={annotationHeight + arrowHeight}
                    width={result.width}
                    key={'orf' + annotation.id + 'start:' + annotationRange.start}
                    top={annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
                    left={-result.xStart}
                    >
                    <Orf
                        annotation={annotation}
                        widthInBps={annotationRange.end - annotationRange.start + 1}
                        charWidth={charWidth}
                        forward={annotation.forward}
                        frame={annotation.frame}
                        normalizedInternalStartCodonIndices={normalizedInternalStartCodonIndices}
                        rangeType={getAnnotationRangeType(annotationRange, annotation, annotation.forward)}
                        height={annotationHeight}
                        name={annotation.name}
                        signals={signals}>
                    </Orf>
                </AnnotationPositioner>
            );
        });
        let containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
        return (
            <AnnotationContainerHolder
                className='Orfs'
                containerHeight={containerHeight}>
                {annotationsSVG}
            </AnnotationContainerHolder>
        );

    }
});
module.exports = Orfs;
