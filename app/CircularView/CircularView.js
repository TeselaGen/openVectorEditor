import React from 'react';
import Draggable from 'react-draggable';
import { Decorator as Cerebral } from 'cerebral-view-react';
import _Labels from './Labels';
import _Caret from './Caret';
import _Axis from './Axis';
import _Orfs from './Orfs';
import _Features from './Features';
import _Cutsites from './Cutsites';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import getAngleForPositionMidpoint from './getAngleForPositionMidpoint';
import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';
import getPositionFromAngle from 've-range-utils/getPositionFromAngle';
// old imports
import getRangeAngles from 've-range-utils/getRangeAngles';
import Sector from 'paths-js/sector';

function noop(argument) {
    //console.log('noop!');
}

function toDegrees(radians) {
    return radians / 2 / Math.PI * 360
}

@Cerebral({
    annotationHeight: ['annotationHeight'],    
    charWidth: ['charWidth'], 
    circularAndLinearTickSpacing: ['circularAndLinearTickSpacing'],    
    circularViewData: ['circularViewData'],    
    circularViewDimensions: ['circularViewDimensions'], 
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],         
    cutsites: ['cutsites'],
    orfs: ['orfData'],
    selectionLayer: ['selectionLayer'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations'],

    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showCaret: ['showCaret'],
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
        var nearestBP = normalizePositionByRangeLength(getPositionFromAngle(angle, sequenceLength, true), sequenceLength) //true because we're in between positions
        var caretGrabbed = event.target.className && event.target.className.animVal === "cursor"
        callback({
            shiftHeld: event.shiftKey,
            nearestBP,
            caretGrabbed
        });
    }

    render() {
        var {
            signals,
            circularViewDimensions,
            sequenceData,
            sequenceLength,
            selectionLayer,
            sequenceName,
            cutsites,
            orfs,
            showAxis,
            showCaret,
            showCutsites,
            showFeatures,
            showOrfs,
            annotationHeight,
            spaceBetweenAnnotations,
            annotationVisibility,
            caretPosition,
            componentOverrides={}
        } = this.props;

        var {
            Labels = _Labels,
            // SelectionLayer = _SelectionLayer,
            Caret = _Caret,
            Axis = _Axis,
            Orfs = _Orfs,
            Features = _Features,
            Cutsites = _Cutsites,
        } = componentOverrides

        const baseRadius = 80;
        var currentRadius = baseRadius;
        var innerRadius = baseRadius - annotationHeight / 2; //tnr: -annotationHeight/2 because features are drawn from the center
        var radius = baseRadius;
        var annotationsSvgs = [];
        var labels = {}

        //DRAW FEATURES
        if (showFeatures) {
            var featureResults = Features({
                radius,
                features: sequenceData.features,
                annotationHeight,
                spaceBetweenAnnotations,
                sequenceLength,
                signals
            })
            // console.log('features results ' + featureResults.component)
            // update the radius, labels, and svg
            radius+= featureResults.height
            labels = {...labels, ...featureResults.labels}
            annotationsSvgs.push(featureResults.component)
        }

        //DRAW AXIS
        if (showAxis) {
            var axisResult = Axis({
                            radius: radius + 8,
                            innerRadius: radius + 4,
                            sequenceLength
                            })
            //update the radius, and svg
            radius+= axisResult.height
            annotationsSvgs.push(axisResult.component)
        }

        //DRAW CUTSITES
        if (showCutsites) {
            var cutsiteResults = Cutsites({
                cutsites,
                radius,
                annotationHeight,
                sequenceLength
            })
            //update the radius, labels, and svg
            radius+= cutsiteResults.height
            labels = {...labels, ...cutsiteResults.labels}
            annotationsSvgs.push(cutsiteResults.component)
        }

        //DRAW ORFS
        if (showOrfs) {
            var orfResults = Orfs({
                orfs,
                radius,
                annotationHeight,
                sequenceLength
            })
            radius+= orfResults.height
            annotationsSvgs.push(orfResults.component)
        }

        // patch in old stuff

        if (selectionLayer.selected) {
            var {
                startAngle,
                endAngle,
                totalAngle
            } = getRangeAngles(selectionLayer, sequenceLength);

            var sector = Sector({
                center: [0, 0], //the center is always 0,0 for our annotations :) we rotate later!
                r: baseRadius - annotationHeight / 2,
                R: radius,
                start: 0,
                end: totalAngle
            });
            annotationsSvgs.push(
                <PositionAnnotationOnCircle
                    sAngle={ startAngle }
                    eAngle={ endAngle }
                    height={ 0 }
                    >
                    <path
                        style={{ opacity: .4}}
                        d={ sector.path.print() }
                        fill="blue" 
                        />
                </PositionAnnotationOnCircle>
            );
            annotationsSvgs.push(
                <Caret 
                    key='caretStart'
                    caretPosition={selectionLayer.start}
                    sequenceLength={sequenceLength}
                    innerRadius={innerRadius}
                    outerRadius={radius}
                    />
            );
            annotationsSvgs.push(
                <Caret 
                    key='caretEnd'
                    caretPosition={selectionLayer.end + 1}
                    sequenceLength={sequenceLength}
                    innerRadius={innerRadius}
                    outerRadius={radius}
                    />
            );
        }
        // nothing selected, just put a caret at posirtion 0
        if (caretPosition !== -1 && !selectionLayer.selected) {
            annotationsSvgs.push(
                <Caret 
                    caretPosition={caretPosition}
                    sequenceLength={sequenceLength}
                    innerRadius={innerRadius}
                    outerRadius={radius}
                    />
            );
        }

        // stop patching        

        annotationsSvgs.push(Labels({labels, outerRadius: radius}))
        radius+=50

        return (
            <Draggable
                bounds={{top: 0, left: 0, right: 0, bottom: 0}}
                onDrag={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, sequenceLength, signals.editorDragged)}
                }
                onStart={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, sequenceLength, signals.editorDragStarted)}
                }
                onStop={signals.editorDragStopped}
                >
                <svg
                    onClick={(event) => {
                        this.getNearestCursorPositionToMouseEvent(event, sequenceLength, signals.editorClicked);
                    }}
                    style={{overflow: 'visible'}}
                    width={ circularViewDimensions.width }
                    height={ circularViewDimensions.height }
                    ref="circularView"
                    className={'circularViewSvg'}
                    viewBox={ `-${radius} -${radius} ${radius*2} ${radius*2}` }
                    >
                    <text x={0} y={0} textAnchor={'middle'} /*fontSize={14}*/ style={{dominantBaseline: 'central'}}>
                        <tspan x={0} y={'0.6em'} dy={'-1.2em'}>{ sequenceName }</tspan>
                        <tspan x={0} dy={'1.2em'}>{`(${ sequenceLength } bp)`}</tspan>
                    </text>

                    { annotationsSvgs }

                </svg>
            </Draggable>
        );
    }
}
