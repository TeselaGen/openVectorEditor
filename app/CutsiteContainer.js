let React = require('react');
let classnames = require('classnames');
let setSelectionLayer = require('./actions/setSelectionLayer');
let getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
let getAnnotationRangeType = require('ve-range-utils/getAnnotationRangeType');
let Cutsite = require('./Cutsite');
let PureRenderMixin = require('react/addons').addons.PureRenderMixin;

let AnnotationContainerHolder = require('./AnnotationContainerHolder');
let AnnotationPositioner = require('./AnnotationPositioner');

let CutsiteContainer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        annotationRanges: React.PropTypes.array.isRequired,
        charWidth: React.PropTypes.number.isRequired,
        bpsPerRow: React.PropTypes.number.isRequired,
        annotationHeight: React.PropTypes.number.isRequired,
        spaceBetweenAnnotations: React.PropTypes.number.isRequired
    },
    render: function() {
        let annotationRanges = this.props.annotationRanges;
        let bpsPerRow = this.props.bpsPerRow;
        let charWidth = this.props.charWidth;
        let annotationHeight = this.props.annotationHeight;
        let spaceBetweenAnnotations = this.props.spaceBetweenAnnotations;

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