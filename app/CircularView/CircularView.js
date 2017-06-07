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
import getRangeAngles from 've-range-utils/getRangeAngles';
import Sector from 'paths-js/sector';

function noop(argument) {

}

function toDegrees(radians) {
    return radians / 2 / Math.PI * 360
}

@Cerebral({
    annotationHeight: ['annotationHeight'],
    bpsPerRow: ['bpsPerRow'],
    caretPosition: ['caretPosition'],
    charWidth: ['charWidth'],
    circularViewData: ['circularViewData'],
    circularViewDimensions: ['circularViewDimensions'],
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],
    cutsites: ['cutsites'],
    orfs: ['orfData'],
    selectionLayer: ['selectionLayer'],
    sequenceData: ['sequenceData'],
    sequenceLength: ['sequenceLength'],
    sequenceName: ['sequenceData', 'name'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showCaret: ['showCaret'],
    showSequence: ['showSequence'],
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations']
})

export default class CircularView extends React.Component {
    getNearestCursorPositionToMouseEvent(event, sequenceLength, callback) {

        if (event.target.nodeName.toLowerCase() === "path" ||
            event.target.nodeName.toLowerCase() === "circle" ||
            event.target.className === "cutsiteLabel" ||
            event.target.className.baseVal === "velabelText veCircularViewLabelText clickable veCutsiteLabel" ||
            event.target.className.baseVal === "velabelText veCircularViewLabelText clickable veFeatureLabel") {
            return;
        }

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
            caretGrabbed,
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
            showCircular,
            annotationHeight,
            spaceBetweenAnnotations,
            annotationVisibility,
            caretPosition,
            bpsPerRow,
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
                signals,
                bpsPerRow
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
                            radius: radius,
                            innerRadius: radius - 4,
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
                radius: radius - 4,
                annotationHeight,
                sequenceLength,
                signals,
                bpsPerRow
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
                sequenceLength,
                signals,
                bpsPerRow
            })
            radius+= orfResults.height
            // orfs don't get labels since they don't have names
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
                    key='veSelectionLayer'
                    className='veSelectionLayer'
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
                    key="caret"
                    caretPosition={caretPosition}
                    sequenceLength={sequenceLength}
                    innerRadius={innerRadius}
                    outerRadius={radius}
                    />
            );
        }

        // stop patching

        annotationsSvgs.push(Labels({labels, outerRadius: radius}))

        if (showCircular) {
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
                        style={{height: '100%', display: 'block', width: '100%'}}
                        // width={ circularViewDimensions.width }
                        // height={ circularViewDimensions.height }
                        ref="circularView"
                        className={'circularViewSvg'}
                        viewBox={'-150 -150 300 300'} // scaling svg to crop
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                        <defs>
                            <marker id="codon" markerWidth="3" markerHeight="3" refx="0" refy="3" orient="auto">
                                <circle fill="red" cx="0" cy="0" r="2"/>
                            </marker>
                            <marker id="arrow" markerWidth="3" markerHeight="3" refx="0" refy="3" orient="auto">
                                <path
                                    d="M 0 0 L 0 6 L 9 150 L 200 50"
                                    stroke="red"
                                    strokeWidth="3"
                                    fill="none"
                                    />
                            </marker>
                        </defs>
                        <text x={0} y={0} fontSize={'14px'} textAnchor={'middle'} style={{dominantBaseline: 'central'}}>
                            <tspan x={0} y={'0.6em'} dy={'-1.2em'} fontSize={'12px'}>{ sequenceName }</tspan>
                            <tspan x={0} dy={'1.2em'} fontSize={'10px'}>{`(${ sequenceLength } bp)`}</tspan>
                        </text>

                        { annotationsSvgs }

                    </svg>
                </Draggable>
            );
        }

        return (
            <div style={{display: "none"}}></div>
        );
    }
}
