let React = require('react');
let getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
let getAnnotationRangeType = require('ve-range-utils/getAnnotationRangeType');
let Orf = require('./Orf');
let AnnotationContainerHolder = require('./AnnotationContainerHolder');
let AnnotationPositioner = require('./AnnotationPositioner');
let PureRenderMixin = require('react-addons-pure-render-mixin');
let Orfs = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        annotationRanges: React.PropTypes.array.isRequired,
        charWidth: React.PropTypes.number.isRequired,
        bpsPerRow: React.PropTypes.number.isRequired,
        annotationHeight: React.PropTypes.number.isRequired,
        spaceBetweenAnnotations: React.PropTypes.number.isRequired,
        orfClicked: React.PropTypes.func.isRequired
    },    
    render: function() {
        var {
            annotationRanges,
            bpsPerRow,
            charWidth,
            annotationHeight,
            spaceBetweenAnnotations, 
            orfClicked,
            orfRightClicked,
            row
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
            })
            
            let result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
            annotationsSVG.push(
                <AnnotationPositioner 
                    className={'veRowViewOrfs'} 
                    height={annotationHeight} 
                    width={result.width}
                    key={'orf' + annotation.id + 'start:' + annotationRange.start}
                    top= {annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
                    left={result.xStart}
                    >
                      <Orf
                        annotation={annotation}
                        color={annotation.color}
                        orfClicked={orfClicked}
                        orfRightClicked={orfRightClicked}
                        width={result.width}
                        charWidth={charWidth}
                        forward={annotation.forward}
                        frame={annotation.frame}
                        normalizedInternalStartCodonIndices={normalizedInternalStartCodonIndices}
                        rangeType={getAnnotationRangeType(annotationRange, annotation, annotation.forward)}
                        height={annotationHeight}
                        name={annotation.name}>
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
