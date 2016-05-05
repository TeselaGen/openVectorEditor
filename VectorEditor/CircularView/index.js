import _Labels from './Labels';
import _SelectionLayer from './SelectionLayer';
import _Caret from './Caret';
import _Axis from './Axis';
import _Features from './Features';
import _Cutsites from './Cutsites';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import getAngleForPositionMidpoint from './getAngleForPositionMidpoint';
import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';
import getPositionFromAngle from 've-range-utils/getPositionFromAngle';
import React from 'react';
import Draggable from 'react-draggable';
import './style.scss';
export const draggableClassNames = ['selectionStart', 'selectionEnd', 'caretSvg'].reduce(function (obj, key) {
    obj[key] = key
    return obj
}, {});
function noop(argument) {
    //console.log('noop!');
}

function toDegrees(radians) {
    return radians / 2 / Math.PI * 360
}

export default class CircularView extends React.Component {
    getNearestCursorPositionToMouseEvent(event, sequenceLength, callback) {
        if (!event.clientX) {
            return;
        }
        var boundingRect = this.refs.circularView.getBoundingClientRect()
        //get relative click positions
        // //console.log('event.clientX: ' + JSON.stringify(event.clientX,null,4));
        // //console.log('event.clientY: ' + JSON.stringify(event.clientY,null,4));
        var clickX = (event.clientX - boundingRect.left - boundingRect.width/2)
        var clickY = (event.clientY - boundingRect.top - boundingRect.height/2)
        // //console.log('clickX: ' + JSON.stringify(clickX,null,4));
        // //console.log('clickY: ' + JSON.stringify(clickY,null,4));

        //get angle
        var angle = Math.atan2(clickY, clickX) + Math.PI/2
        if (angle < 0) angle += Math.PI * 2 //normalize the angle if necessary
        var nearestCaretPos = normalizePositionByRangeLength(getPositionFromAngle(angle, sequenceLength, true), sequenceLength) //true because we're in between positions
        var caretGrabbed = event.target.className && event.target.className.animVal === "cursor"
        callback({
            className: event.target.className.animVal,
            shiftHeld: event.shiftKey,
            nearestCaretPos,
            caretGrabbed
        })
    }

    render() {
        var {
            //set defaults for all of these vars
            circularViewDimensions = {
                width: 400,
                height: 400,
            },
            sequenceData,
            cutsites = [],
            selectionLayer = {start: -1, end: -1},
            annotationHeight = 15,
            spaceBetweenAnnotations=2,
            annotationVisibility = {},
            caretPosition = -1,
            circularAndLinearTickSpacing,
            editorDragged = noop,
            editorDragStarted = noop,
            editorClicked = noop,
            editorDragStopped = noop,
            featureClicked = noop,
            cutsiteClicked = noop,
            namespace='',
            componentOverrides={}
        } = this.props;

        var {
                Labels = _Labels,
                SelectionLayer = _SelectionLayer,
                Caret = _Caret,
                Axis = _Axis,
                Features = _Features,
                Cutsites = _Cutsites,
        } = componentOverrides

        var sequenceLength = sequenceData.sequence.length
        circularAndLinearTickSpacing = circularAndLinearTickSpacing 
            || (sequenceLength < 10
                ? 1
                : sequenceLength < 50
                    ? Math.ceil(sequenceLength / 5)
                    : Math.ceil(sequenceLength / 100) * 10)
        // //console.log('annotationVisibility: ', annotationVisibility);
        var {
            features: showFeatures = true,
            translations: showTranslations = true,
            parts: showParts = true,
            orfs: showOrfs = true,
            cutsites: showCutsites = true,
            firstCut: showFirstCut = true,
            axis: showAxis = true,
            sequence: showSequence = true,
            reverseSequence: showReverseSequence = true,
        } = annotationVisibility
        const baseRadius = 80;
        var innerRadius = baseRadius - annotationHeight / 2; //tnr: -annotationHeight/2 because features are drawn from the center
        var radius = baseRadius;
        var annotationsSvgs = [];
        var labels = {}



        //RENDERING CONCEPTS:
        //-"Circular" annotations get a radius, and a curvature based on their radius:
        //<CircularFeature>
        //-Then we rotate the annotations as necessary (and optionally flip them):
        //<PositionAnnotationOnCircle>
        // var labels = []
        //DRAW FEATURES
        // //console.log(':all da things ' + JSON.stringify({
        //         radius,
        //         featureClicked,
        //         features: sequenceData.features,
        //         annotationHeight,
        //         spaceBetweenAnnotations,
        //         sequenceLength,
        //     },null,4));
        if (showFeatures) {
            var featureResults = Features({
                radius,
                featureClicked,
                features: sequenceData.features,
                annotationHeight,
                spaceBetweenAnnotations,
                sequenceLength,
                namespace
            })
            //update the radius, labels, and svg
            radius+= featureResults.height
            labels = {...labels, ...featureResults.labels}
            annotationsSvgs.push(featureResults.component)
        }

        //DRAW CHARS (only if there are fewer than 85 of them)
        if (sequenceLength < 85) {
            radius+=25;
            sequenceData.sequence.split('').forEach(function(bp, index) {
                var tickAngle = getAngleForPositionMidpoint(index, sequenceLength);
                annotationsSvgs.push(
                    <PositionAnnotationOnCircle
                      key={ index }
                      sAngle={ tickAngle }
                      eAngle={ tickAngle }
                      height={ radius }>
                      <text
                        transform={`rotate(180)` }
                        style={ {    textAnchor: "middle",    dominantBaseline: "central",    fontSize: 'small'} }>
                        { bp }
                      </text>
                    </PositionAnnotationOnCircle>
                )
            })
        }

        //DRAW AXIS
        if (showAxis) {
            var axisResult = Axis({
                            radius: radius,
                            sequenceLength,
                            circularAndLinearTickSpacing,
                            })
            //update the radius, and svg
            radius+= axisResult.height
            annotationsSvgs.push(axisResult.component)
        }

        radius-=10
        //DRAW CUTSITES
        if (showCutsites) {
            var cutsiteResults = Cutsites({
                cutsites,
                radius,
                annotationHeight,
                sequenceLength,
                cutsiteClicked,
                namespace
            })
            //update the radius, labels, and svg
            radius+= cutsiteResults.height
            labels = {...labels, ...cutsiteResults.labels}
            annotationsSvgs.push(cutsiteResults.component)
        }

        //DRAW SELECTION LAYER
        if (selectionLayer.start >= 0 && selectionLayer.end >= 0 && sequenceLength > 0) {
            annotationsSvgs.push(SelectionLayer({
                selectionLayer, 
                sequenceLength, 
                baseRadius: baseRadius, 
                radius: radius, 
                innerRadius}))
        }

        //DRAW CARET
        if (caretPosition !== -1 && selectionLayer.start < 0 && sequenceLength > 0) { //only render if there is no selection layer
            annotationsSvgs.push(
                <Caret
                    key='caret'
                    className={draggableClassNames.caretSvg}
                    caretPosition={caretPosition}
                    sequenceLength={sequenceLength}
                    innerRadius={innerRadius}
                    outerRadius={radius}
                />
            )
        }
        // //console.log('labels: ' + JSON.stringify(labels,null,4));
        //DRAW LABELS
        annotationsSvgs.push(Labels({namespace, labels, outerRadius: radius}))
        radius+=50
  // var labels = [...cutsiteSvgs.labels, ...featureSvgs.labels]
  //       annotationsSvgs.push(Labels({labels, outerRadius: radius}))
        // //console.log('cutsiteResults: ', cutsiteResults);
        //console.log('RERENDERING SVG');
        return (
            <Draggable
            bounds={{top: 0, left: 0, right: 0, bottom: 0}}
            onDrag={(event) => {
                this.getNearestCursorPositionToMouseEvent(event, sequenceLength, editorDragged)}
            }
            onStart={(event) => {
                this.getNearestCursorPositionToMouseEvent(event, sequenceLength, editorDragStarted)}
            }
            onStop={editorDragStopped}
            >
                  <svg
                    onClick={(event) => {
                      this.getNearestCursorPositionToMouseEvent(event, sequenceLength, editorClicked)}
                    }
                    style={{overflow: 'visible'}}
                    width={ circularViewDimensions.width }
                    height={ circularViewDimensions.height }
                    ref="circularView"
                    className={'circularViewSvg'}
                    viewBox={ `-${radius} -${radius} ${radius*2} ${radius*2}` }
                    >
                      { annotationsSvgs }
                  </svg>
            </Draggable>
            );
    }
}
