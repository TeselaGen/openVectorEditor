let React = require('react');
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
            signals
        } = this.props;

        if (annotationRanges.length === 0) {
            return null;
        }

        let maxAnnotationYOffset = 0;
        let annotationsSVG = [];
        var sequenceText = document.getElementById("sequenceText");
        var textWidth = sequenceText.firstChild.firstChild.getBoundingClientRect().width + 10; // 10 for left & right padding around text box
        var rowCenter = textWidth / 2;
        var iTree = new intervalTree2(rowCenter)
        // var overlapInterval = textWidth * ((2 % bpsPerRow) / bpsPerRow);

        forEach(annotationRanges,function(annotationRange, index) {
            let annotation = annotationRange.annotation;
            if (!annotation) {
                annotation = annotationRange
            }
            var annotationLength = annotation.restrictionEnzyme.name.length * textWidth;

            var xStart = textWidth * ((annotationRange.start % bpsPerRow) / bpsPerRow) + 15; //move selection right
            var width = textWidth * (((annotationRange.end - annotationRange.start) % bpsPerRow) / bpsPerRow); //move selection right
            xStart += width/2;
            var xEnd = xStart + annotationLength;
            var yOffset = getYOffset(iTree, xStart, xEnd);
            iTree.add(xStart, xEnd, undefined, {...annotationRange, yOffset})

            if (yOffset > maxAnnotationYOffset) {
                maxAnnotationYOffset = yOffset;
            }

            annotationsSVG.push(
                <div
                    id={annotation.id}
                    key={'cutsiteLabel' + index}
                    onClick={ function (e) {
                        e.stopPropagation()
                        signals.cutsiteClicked({annotation: annotation})
                    }}
                    >
                    <div
                        left={xStart}
                        style={{
                            position: 'absolute',
                            left: xStart,
                            top: yOffset * -10,
                            zIndex: 10
                        }}
                        >
                        {annotation.restrictionEnzyme.name}
                    </div>
                </div>
            );
        });

        let containerHeight = annotationHeight;
        return (
            <div
                width="100%"
                style={{
                    position: 'relative',
                    height: '10px',
                    display: 'block'
                }}
                >
                {annotationsSVG}
            </div>
        );
    }
});

module.exports = CutsiteLabels;
