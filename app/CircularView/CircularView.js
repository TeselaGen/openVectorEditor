import React from 'react';
import Draggable from 'react-draggable';
import { Decorator as Cerebral } from 'cerebral-view-react';
// import _Labels from './Labels';
import _SelectionLayer from './SelectionLayer';
// import _Caret from './Caret';
import _Axis from './Axis';
// import _Features from './Features';
// import _Cutsites from './Cutsites';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import getAngleForPositionMidpoint from './getAngleForPositionMidpoint';
import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';
import getPositionFromAngle from 've-range-utils/getPositionFromAngle';

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

@Cerebral({
    circularViewDimensions: ['circularViewDimensions'],
    circularViewData: ['circularViewData'], 
    charWidth: ['charWidth'], 
    selectionLayer: ['selectionLayer'],
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'], 
    annotationHeight: ['annotationHeight'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations'],
    circularAndLinearTickSpacing: ['circularAndLinearTickSpacing'],
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
    sequenceData: ['sequenceData'],
    sequenceName: ['sequenceData', 'name']
})

export default class CircularView extends React.Component {
    getNearestCursorPositionToMouseEvent(event, sequenceLength, callback) {
        if (!event.clientX) {
            return;
        }
        var boundingRect = this.refs.circularView.getBoundingClientRect()
        //get relative click positions
        var clickX = (event.clientX - boundingRect.left - boundingRect.width/2)
        var clickY = (event.clientY - boundingRect.top - boundingRect.height/2)

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
            sequenceLength,
            sequenceName,
            cutsites = [],
            selectionLayer = {start: -1, end: -1},
            showAxis,
            showCaret,
            showFeatures,
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
        //     Labels = _Labels,
            SelectionLayer = _SelectionLayer,
            // Caret = _Caret,
            Axis = _Axis,
            // Features = _Features,
        //     Cutsites = _Cutsites,
        } = componentOverrides

        //console.log('annotationVisibility: ', annotationVisibility);
        // var {
        //     features: showFeatures = true,
        //     translations: showTranslations = true,
        //     parts: showParts = true,
        //     orfs: showOrfs = true,
        //     cutsites: showCutsites = true,
        //     firstCut: showFirstCut = true,
        //     axis: showAxis = true,
        //     sequence: showSequence = true,
        //     reverseSequence: showReverseSequence = true,
        // } = annotationVisibility
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
        //console.log(':all da things ' + JSON.stringify({
            //     radius,
            //     featureClicked,
            //     features: sequenceData.features,
            //     annotationHeight,
            //     spaceBetweenAnnotations,
            //     sequenceLength,
            // },null,4));
        // if (showFeatures) {
        //     var featureResults = Features({
        //         radius,
        //         featureClicked,
        //         features: sequenceData.features,
        //         annotationHeight,
        //         spaceBetweenAnnotations,
        //         sequenceLength,
        //         namespace
        //     })
        //     console.log('features results ' + featureResults)
        //     // update the radius, labels, and svg
        //     radius+= featureResults.height
        //     // labels = {...labels, ...featureResults.labels}
        //     annotationsSvgs.push(featureResults.component)
        // }

        //DRAW AXIS
        if (showAxis) {
            var axisResult = Axis({
                            radius: radius,
                            innerRadius,
                            sequenceLength
                            })
            //update the radius, and svg
            radius+= axisResult.height
            annotationsSvgs.push(axisResult.component)
        }

        radius-=10
        // //DRAW CUTSITES
        // if (showCutsites) {
        //     var cutsiteResults = Cutsites({
        //         cutsites,
        //         radius,
        //         annotationHeight,
        //         sequenceLength,
        //         cutsiteClicked,
        //         namespace
        //     })
        //     //update the radius, labels, and svg
        //     radius+= cutsiteResults.height
        //     labels = {...labels, ...cutsiteResults.labels}
        //     annotationsSvgs.push(cutsiteResults.component)
        // }

        //DRAW SELECTION LAYER
        if (selectionLayer.start >= 0 && selectionLayer.end >= 0 && sequenceLength > 0) {
            annotationsSvgs.push(SelectionLayer({
                selectionLayer, 
                sequenceLength, 
                baseRadius: baseRadius, 
                radius: radius, 
                innerRadius
            }))
        }

        //DRAW CARET
        console.log("caretposition: " + caretPosition);
        console.log("start: " + selectionLayer.start);
        console.log("sequence length: " + sequenceLength);
        // if (caretPosition !== -1 && selectionLayer.start < 0 && sequenceLength > 0) { //only render if there is no selection layer
        //     annotationsSvgs.push(
        //         <Caret
        //             key='caret'
        //             className={draggableClassNames.caretSvg}
        //             caretPosition={caretPosition}
        //             sequenceLength={sequenceLength}
        //             innerRadius={innerRadius}
        //             outerRadius={radius}
        //             />
        //     )
        // }
        //console.log('labels: ' + JSON.stringify(labels,null,4));
        //DRAW LABELS
        // annotationsSvgs.push(Labels({namespace, labels, outerRadius: radius}))
        // radius+=50
  // var labels = [...cutsiteSvgs.labels, ...featureSvgs.labels]
  //       annotationsSvgs.push(Labels({labels, outerRadius: radius}))
        // //console.log('cutsiteResults: ', cutsiteResults);

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
                    <text x={0} y={0} textAnchor={'middle'} fontSize={14} style={{dominantBaseline: 'central'}}>
                        <tspan x={0} y={'0.6em'} dy={'-1.2em'}>{ sequenceName }</tspan>
                        <tspan x={0} dy={'1.2em'} style={{textSize: '8px'}}>{`(${ sequenceLength } bp)`}</tspan>
                    </text>

                    { annotationsSvgs }

                </svg>
            </Draggable>
        );
    }
}
