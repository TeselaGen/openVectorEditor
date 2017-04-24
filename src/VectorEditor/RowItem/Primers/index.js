import Sequence from '../Sequence';
import getSequenceWithinRange from 've-range-utils/getSequenceWithinRange';
import './style.scss'
import forEach from 'lodash/forEach'
import React, { PropTypes } from 'react';
// import './style.scss'
let getXStartAndWidthOfRowAnnotation = require('../getXStartAndWidthOfRowAnnotation');
let getAnnotationRangeType = require('ve-range-utils/getAnnotationRangeType');
let Primer = require('./Primer');
let PureRenderMixin = require('react-addons-pure-render-mixin');

let AnnotationContainerHolder = require('../AnnotationContainerHolder');
let AnnotationPositioner = require('../AnnotationPositioner');

let Primers = React.createClass({
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
        primerClicked: PropTypes.func.isRequired,
    },
    render: function() {
        var {
            annotationRanges=[],
            bpsPerRow,
            charWidth,
            annotationHeight=12,
            spaceBetweenAnnotations=2,
            primerClicked,
            primerRightClicked,
            HoverHelper,

            sequence=''
        } = this.props;
        if (annotationRanges.length === 0) {
            return null;
        }
        let maxAnnotationYOffset = 0;
        let annotationsSVG = [];
        forEach(annotationRanges, function(annotationRange, index) {
            var seqInRow = getSequenceWithinRange(annotationRange, sequence)
            if (annotationRange.yOffset > maxAnnotationYOffset) {
                maxAnnotationYOffset = annotationRange.yOffset;
            }
            let annotation = annotationRange.annotation;
            let result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
            // var isStart = annotationRange.enclosingRangeType === "beginningAndEnd" || annotationRange.enclosingRangeType === "beginningAndEnd"
            // console.log('annotationRange:', annotationRange)
            // console.log('isStart:', isStart)
            // var {color='orange'} = annotation
            // var {startOffset} = result
            // var width = seqInRow.length * charWidth
            // var height = annotationHeight
            // var bufferBottom = 4
            // var bufferLeft = 2
            // var arrowHeight = isStart ? 8 : 0
            annotationsSVG.push(
              <HoverHelper
                passJustOnMouseOverAndClassname
                // onHover={function () {
                  //     debugger
                  // }}
                  key={'primer' + index}
                  id={annotation.id}
                  >
                  <div onClick={function () {
                  }}>
                  <AnnotationPositioner
                    height={annotationHeight}
                    width={result.width}
                    key={index}
                    top= {annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
                    left={result.xStart}
                    >
                    <Primer
                      key={index}
                      primerClicked={primerClicked}
                      primerRightClicked={primerRightClicked}
                      annotation={annotation}
                      color={annotation.color}
                      widthInBps={annotationRange.end - annotationRange.start + 1}
                      charWidth={charWidth}
                      forward={annotation.forward}
                      rangeType={getAnnotationRangeType(annotationRange, annotation, annotation.forward)}
                      height={annotationHeight}
                      name={annotation.name}>
                    </Primer>
                  </AnnotationPositioner>
                   
                    
                  </div>
              </HoverHelper>
            );
        });
        let containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);

        return (
            <AnnotationContainerHolder
                className={'veRowViewPrimerContainer'}
                containerHeight={containerHeight}>
                {annotationsSVG}
            </AnnotationContainerHolder>
        );

    }
});
module.exports = Primers;



// <Sequence
//     key={index}
//     sequence={seqInRow}
//     startOffset={startOffset}
//     height={height}
//     containerStyle={{
//         marginTop: 8,
//         marginBottom: 6,
//     }}
//     length={seqInRow.length}
//     charWidth={charWidth}>
//     <svg style={{left: startOffset * charWidth, height: annotationHeight, position: 'absolute'}} 
//         ref="rowViewTextContainer" 
//         onClick={function (event) {
//           primerClicked({event, annotation})
//         }}
//         onContextMenu={function (event) {
//           primerRightClicked({event, annotation})
//         }}
//         className="rowViewTextContainer clickable" width={width} height={height}>
//         <polyline 
//           points={`${-bufferLeft},0 ${-bufferLeft},${-arrowHeight}, ${charWidth/2},0 ${width},0 ${width},${height + bufferBottom} ${-bufferLeft},${height + bufferBottom} ${-bufferLeft},0`} 
//           fill="none" 
//           stroke={color} 
//           strokeWidth="2px"/>
//     </svg>
// </Sequence>