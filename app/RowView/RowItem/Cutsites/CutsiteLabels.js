let React = require('react');
let PureRenderMixin = require('react-addons-pure-render-mixin');
import intervalTree2 from 'interval-tree2';
import getYOffset from '../../../CircularView/getYOffset'
import forEach from 'lodash/collection/forEach'
import assign from 'lodash/object/assign'

let CutsiteLabels = React.createClass({

    render: function() {
        var {
            annotationRanges={},
            bpsPerRow,
            signals
        } = this.props;

        if (annotationRanges.length === 0) {
            return null;
        }

        let maxAnnotationYOffset = 0;
        let annotationsSVG = [];
        var sequenceText = document.getElementById("sequenceText");
        if (sequenceText && sequenceText.firstChild) {
            var textWidth = sequenceText.firstChild.firstChild.getBoundingClientRect().width + 10; // 10 for left & right padding around text box
        } else {
            var textWidth = 20;
        }
        var rowCenter = textWidth / 2;
        var iTree = new intervalTree2(rowCenter)

        forEach(annotationRanges,function(annotationRange, index) {
            let annotation = annotationRange.annotation;
            if (!annotation) {
                annotation = annotationRange
            }

            var annotationLength = 10 * annotation.restrictionEnzyme.name.length; // 10 is a charwidth approx. bc font is not monospace
            var xStart = textWidth * ((annotationRange.start % bpsPerRow) / bpsPerRow) + 15; //move selection right
            var width = textWidth * (((annotationRange.end - annotationRange.start) % bpsPerRow) / bpsPerRow);
            xStart += width / 2;
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
                        e.stopPropagation();
                        signals.cutsiteClicked({ annotation: annotation });
                    }}
                    // onDoubleClick={ function (e) {
                    //     e.stopPropagation();
                    //     signals.sidebarToggle({ sidebar: true, annotation: annotation, view: "row" });
                    // }}
                    >
                    <div
                        left={xStart}
                        style={{
                            position: 'absolute',
                            left: xStart,
                            bottom: yOffset * 15,
                            zIndex: 10
                        }}
                        >
                        {annotation.restrictionEnzyme.name}
                    </div>
                </div>
            );
        });

        return (
            <div
                width="100%"
                style={{
                    position: 'relative',
                    height: 15*(maxAnnotationYOffset+1),
                    display: 'block'
                }}
                >
                {annotationsSVG}
            </div>
        );
    }
});

module.exports = CutsiteLabels;
