let React = require('react');
let getXStartAndWidthOfRowAnnotation = require('../../../shared-utils/getXStartAndWidthOfRowAnnotation');
let getAnnotationRangeType = require('ve-range-utils/getAnnotationRangeType');
let Cutsite = require('./Cutsite');
let PureRenderMixin = require('react-addons-pure-render-mixin');

let AnnotationContainerHolder = require('../AnnotationContainerHolder');
let AnnotationPositioner = require('../AnnotationPositioner');

let CutsiteContainer = React.createClass({

    render: function() {
        var {
            annotationRanges,
            bpsPerRow,
            charWidth,
            annotationHeight,
            spaceBetweenAnnotations,
            setSelectionLayer,
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
            let annotation = annotationRange.annotation;
            let result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
            annotationsSVG.push(
                <AnnotationPositioner
                    height={annotationHeight}
                    width={result.width}
                    key={'Cutsite' + annotation.id + 'start:' + annotationRange.start}
                    top= {annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
                    left={result.xStart}
                    >
                    <Cutsite
                        onClick={ function (e) {
                            e.stopPropagation();
                            signals.cutsiteClicked({ annotation: annotation });
                        }}
                        ondblclick={ function (e) {
                            e.stopPropagation();
                            signals.sidebarToggle({ sidebar: true, annotation: annotation, view: "row" });
                        }}
                        widthInBps={annotationRange.end - annotationRange.start + 1}
                        charWidth={charWidth}
                        forward={annotation.forward}
                        rangeType={getAnnotationRangeType(annotationRange, annotation, annotation.forward)}
                        height={annotationHeight}
                        color={annotation.color}
                        name={annotation.restrictionEnzyme.name}>
                    </Cutsite>
                </AnnotationPositioner>
            );
        });
        let containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
        return (
            <AnnotationContainerHolder
                className='cutsiteContainer'
                containerHeight={containerHeight}>
                {annotationsSVG}
            </AnnotationContainerHolder>
        );
    }
});
module.exports = CutsiteContainer;
