var Sector = require('paths-js/sector');
var getRangeAngles = require('ve-range-utils/getRangeAngles');
let Cutsite = require('./Cutsite');
let CircularFeature = require('./CircularFeature');
var calculateTickMarkPositionsForGivenRange = require('./calculateTickMarkPositionsForGivenRange');
var StyleFeature = require('./StyleFeature');

import assign from 'lodash/object/assign'
import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-react';
import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies
var Draggable = require('react-draggable');

@Cerebral({
    circularViewDimensions: ['circularViewDimensions'],
    circularViewData: ['circularViewData'],
    charWidth: ['charWidth'],
    selectionLayer: ['selectionLayer'],
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],
    annotationHeight: ['annotationHeight'],
    tickSpacing: ['tickSpacing'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showSequence: ['showSequence'],
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    caretPosition: ['caretPosition'],
    sequenceLength: ['sequenceLength'],
    bpsPerRow: ['bpsPerRow']
})
@propTypes({
    circularViewDimensions: PropTypes.object.isRequired,
    circularViewData: PropTypes.array.isRequired,
    charWidth: PropTypes.number.isRequired,
    selectionLayer: PropTypes.object.isRequired,
    cutsiteLabelSelectionLayer: PropTypes.object.isRequired,
    annotationHeight: PropTypes.number.isRequired,
    tickSpacing: PropTypes.number.isRequired,
    spaceBetweenAnnotations: PropTypes.number.isRequired,
    showFeatures: PropTypes.bool.isRequired,
    showTranslations: PropTypes.bool.isRequired,
    showParts: PropTypes.bool.isRequired,
    showOrfs: PropTypes.bool.isRequired,
    showAxis: PropTypes.bool.isRequired,
    showCutsites: PropTypes.bool.isRequired,
    showReverseSequence: PropTypes.bool.isRequired,
    caretPosition: PropTypes.number.isRequired,
    sequenceLength: PropTypes.number.isRequired,
    bpsPerRow: PropTypes.number.isRequired,
    handleEditorDrag: PropTypes.func.isRequired,
    handleEditorDragStart: PropTypes.func.isRequired,
    handleEditorDragStop: PropTypes.func.isRequired,
    handleEditorClick: PropTypes.func.isRequired,
})
class CircularView extends React.Component {
    getNearestCursorPositionToMouseEvent(event, sequenceLength, callback) {
        var boundingRect = this.refs.circularView.getBoundingClientRect()
        //get relative click positions
        var clickX = event.clientX - boundingRect.left / boundingRect.length
        var clickY = event.clientY - boundingRect.top / boundingRect.height
        //get angle
        var angle = Math.atan2(clickX, clickY)

        var bp = angle / Math.PI * sequenceLength
    }

    render() {
        var {showSequence, circularViewDimensions, circularViewData, handleEditorDrag, handleEditorDragStart, handleEditorDragStop, handleEditorClick, charWidth, selectionLayer, cutsiteLabelSelectionLayer, annotationHeight, tickSpacing, spaceBetweenAnnotations, showFeatures, showTranslations, showParts, showOrfs, showAxis, showCutsites, showReverseSequence, caretPosition, sequenceLength, bpsPerRow, signals} = this.props;
        const baseRadius = 80;
        var currentRadius = baseRadius;
        var gapBetweenAnnotations = 5;
        var totalAnnotationHeight = annotationHeight + gapBetweenAnnotations;
        var annotationsSvgs = [];

        if (showFeatures) {
            var maxYOffset = 0;
            circularViewData.features.forEach(function(annotation, index) {
                var {startAngle, endAngle, totalAngle} = getRangeAngles(annotation, sequenceLength);
                if (annotation.yOffset > maxYOffset) {
                    maxYOffset = annotation.yOffset;
                }

                function onClick(event) {
                    signals.setSelectionLayer({
                        selectionLayer: this
                    });
                    event.stopPropagation();
                }
                annotationsSvgs.push(
                    <PositionAnnotationOnCircle
                      key={ index }
                      sAngle={ startAngle }
                      eAngle={ endAngle }
                      direction={ 'reverse' }>
                      <StyleFeature
                        signals={signals}
                        annotation={annotation}
                        color={ annotation.color }>
                        <CircularFeature
                          radius={ currentRadius }
                          annotationHeight={ annotationHeight }
                          totalAngle={ totalAngle }>
                        </CircularFeature>
                      </StyleFeature>
                    </PositionAnnotationOnCircle>
                )
                currentRadius += maxYOffset + 1 * totalAnnotationHeight
            })
        }

        if (showAxis) {
            var tickMarkHeight = 10;
            var tickMarkWidth = 1;
            var textOffset = 20

            var axisLineThickness = 4;
            currentRadius += textOffset + tickMarkHeight + axisLineThickness


            var tickPositions = calculateTickMarkPositionsForGivenRange({
                range: {
                    start: 0,
                    end: sequenceLength
                },
                tickSpacing: 30
            });

            var tickMarksAndLabels = tickPositions.map(function(tickPosition, index) {
                function getAngleForPositionMidpoint(position, maxLength) {
                    return (position + 0.5) / maxLength * Math.PI * 2;
                }
                var tickAngle = getAngleForPositionMidpoint(tickPosition, sequenceLength);
                var flip = false;
                if ((tickAngle > Math.PI * 0.5) && (tickAngle < Math.PI * 1.5)) {
                    flip = true
                }
                return (
                    <PositionAnnotationOnCircle
                      key={ index }
                      sAngle={ tickAngle }
                      eAngle={ tickAngle }
                      height={ currentRadius }>
                      <text
                        transform={ (flip ? 'rotate(180)' : '') + ` translate(0, ${flip ? -textOffset : textOffset})` }
                        style={ {    textAnchor: "middle",    dominantBaseline: "central",    fontSize: 'small'} }>
                        { tickPosition }
                      </text>
                      <rect
                        width={ tickMarkWidth }
                        height={ tickMarkHeight }>
                      </rect>
                    </PositionAnnotationOnCircle>
                    )
            })
            annotationsSvgs.push(
                <g>
                  { tickMarksAndLabels }
                  <circle
                    r={ currentRadius }
                    style={ {    fill: 'none',    stroke: 'black',    strokeWidth: 1} }>
                  </circle>
                </g>
            )

        }

        if (selectionLayer.selected) {
            var {startAngle, endAngle, totalAngle} = getRangeAngles(selectionLayer, sequenceLength)
            var sector = Sector({
                center: [0, 0], //the center is always 0,0 for our annotations :) we rotate later!
                r: baseRadius - annotationHeight / 2,
                R: currentRadius,
                start: 0,
                end: totalAngle
            });
            annotationsSvgs.push(
                <PositionAnnotationOnCircle
                  sAngle={ startAngle }
                  eAngle={ endAngle }
                  height={ 0 }>
                  <path
                    style={ {    opacity: .4} }
                    d={ sector.path.print() }
                    fill="blue" />
                </PositionAnnotationOnCircle>)
        }
        var circViewStyle = assign({}, circularViewDimensions, {
            height: circularViewDimensions.height,
            overflow: 'scroll',
        })
        return (
            <Draggable
            bounds={{top: 0, left: 0, right: 0, bottom: 0}}
            onDrag={(event) => {
                this.getNearestCursorPositionToMouseEvent(event, handleEditorDrag)}   
            }
            onStart={(event) => {
                this.getNearestCursorPositionToMouseEvent(event, handleEditorDragStart)}   
            }
            onStop={handleEditorDragStop}
            >
                <div style={ circViewStyle }>
                  <svg
                    width={ currentRadius * 2 }
                    height={ currentRadius * 2 }>
                    <g 
                    ref='circularView'
                    transform={ "translate(" + (currentRadius) + "," + (currentRadius) + ")" }>
                      { annotationsSvgs }
                    </g>
                  </svg>
                </div>
            </Draggable>
            );
    }
}

module.exports = CircularView;

var PositionAnnotationOnCircle = function({children, height=0, sAngle=0, eAngle=0, forward=true}) {
    const sAngleDegs = sAngle * 360 / Math.PI / 2
    const eAngleDegs = eAngle * 360 / Math.PI / 2
    var transform;
    if (forward) {
        transform = `translate(0,${-height}) rotate(${sAngleDegs},0,${height})`
    } else {
        transform = `scale(-1,1) translate(0,${-height}) rotate(${-eAngleDegs},0,${height}) `
    }
    return (
        <g transform={ transform }>
          { children }
        </g>
        )
}