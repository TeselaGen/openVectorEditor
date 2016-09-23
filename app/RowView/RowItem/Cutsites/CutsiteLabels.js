let React = require('react');
let getXStartAndWidthOfRowAnnotation = require('../../../shared-utils/getXStartAndWidthOfRowAnnotation');
let PureRenderMixin = require('react-addons-pure-render-mixin');
import intervalTree2 from 'interval-tree2';
import getYOffset from '../../../CircularView/getYOffset'
import forEach from 'lodash/collection/forEach'

let CutsiteLabels = React.createClass({

    render: function() {
        var {
            annotationRanges={},
            bpsPerRow,
            charWidth,
            annotationHeight,
            spaceBetweenAnnotations,
            textWidth=12
        } = this.props;

        if (annotationRanges.length === 0) {
            return null;
        }

        let maxAnnotationYOffset = 0;
        let annotationsSVG = [];
        var rowCenter = bpsPerRow * textWidth / 2;
        var iTree = new intervalTree2(rowCenter)
        forEach(annotationRanges,function(annotationRange, index) {
            let annotation = annotationRange.annotation;
            if (!annotation) {
                annotation = annotationRange
            }
            var annotationLength = annotation.restrictionEnzyme.name.length * textWidth
            let {xStart} = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
            var xEnd = xStart + annotationLength;
            var yOffset = getYOffset(iTree, xStart, xEnd)
            iTree.add(xStart, xEnd, undefined, {...annotationRange, yOffset})

            if (yOffset > maxAnnotationYOffset) {
                maxAnnotationYOffset = yOffset;
            }
            let height = (yOffset) * (annotationHeight + spaceBetweenAnnotations);

            annotationsSVG.push(
                <div
                    id={annotation.id}
                    key={'cutsiteLabel' + index}
                    >
                    <div 
                        left={xStart}
                        style={{
                            position: 'absolute',
                            top: 'height',
                            left: xStart,
                            zIndex: 10
                        }}
                        >
                        {annotation.restrictionEnzyme.name}
                    </div>
                </div>
            );
        });

        let containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
        return (
            <div
                width="100%"
                style={{
                    position: 'relative', 
                    height: {containerHeight}, 
                    display: 'block'
                }}
                className='cutsiteContainer'
                >
                {annotationsSVG}
            </div>
        );
    }
});

module.exports = CutsiteLabels;