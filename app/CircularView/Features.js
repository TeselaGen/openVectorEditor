import StyleFeature from './StyleFeature';
import CircularFeature from './CircularFeature';
import intervalTree2 from 'interval-tree2';
import getRangeAngles from './getRangeAnglesSpecial';
import getYOffset from './getYOffset';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React, { PropTypes } from 'react';
import noop from 'lodash/utility/noop';

export default function Features({radius, namespace='', featureClicked=noop, features=[], annotationHeight, spaceBetweenAnnotations=2, sequenceLength}) {
    //console.log('RENDERING FEATURES');
    var totalAnnotationHeight = annotationHeight + spaceBetweenAnnotations;
    var featureITree = new intervalTree2(Math.PI)
    var maxYOffset = 0
    var svgGroup = []
    var labels = {}
    Object.keys(features).forEach(function(key, index) {
        var annotation = features[key]
        function onClick (event) {
            //console.log('FEATURE CLICKED');
            featureClicked({event, annotation, namespace}) 
            event.stopPropagation()
        }
        var annotationCopy = {...annotation}
        var annotationRadius
        var labelFits

        
        var {startAngle, endAngle, totalAngle, centerAngle} = getRangeAngles(annotation, sequenceLength);
        var spansOrigin = startAngle > endAngle;
        var labelCenter = centerAngle;
        //expand the end angle if annotation spans the origin
        var expandedEndAngle = spansOrigin ? endAngle + 2 * Math.PI : endAngle
        // if (annotationCopy.id === '5590c1d88979df000a4f02f5c') debugger;
        var yOffset1
        var yOffset2
        if (spansOrigin) {
            annotationCopy.yOffset = getYOffset(featureITree, startAngle, expandedEndAngle)
        } else {
            //we need to check both locations to account for annotations that span the origin
            yOffset1 = getYOffset(featureITree, startAngle, expandedEndAngle)
            yOffset2 = getYOffset(featureITree, startAngle + Math.PI * 2, expandedEndAngle + Math.PI * 2)
            annotationCopy.yOffset = Math.max(yOffset1, yOffset2)
        }

        annotationRadius = radius + annotationCopy.yOffset*(annotationHeight + spaceBetweenAnnotations)
        // //console.log('startAngle: ' + JSON.stringify(toDegrees(startAngle),null,4));
        // //console.log('endAngle: ' + JSON.stringify(toDegrees(expandedEndAngle),null,4));
        if (spansOrigin) {
            featureITree.add(startAngle, expandedEndAngle, undefined, {...annotationCopy})
        } else {
            //normal feature
            // we need to add it twice to the interval tree to accomodate features which span the origin
            featureITree.add(startAngle, expandedEndAngle, undefined, {...annotationCopy})
            featureITree.add(startAngle + 2 * Math.PI, expandedEndAngle + 2 * Math.PI, undefined, {...annotationCopy})
        }

        if (annotationCopy.yOffset > maxYOffset) {
            maxYOffset = annotationCopy.yOffset;
        }
        // //console.log('labelCenter: ' + JSON.stringify(labelCenter,null,4));
        // //console.log('shouldFlipText(labelCenter): ' + JSON.stringify(shouldFlipText(labelCenter),null,4));
        if (!annotation.id) debugger;
        svgGroup.push(
            <div 
                namespace={namespace}
                id={annotation.id}
                key={'Features'+index}
                onClick={onClick}
                >
                <g className='Features clickable'>
                    <PositionAnnotationOnCircle
                        key={ 'feature' + index }
                        sAngle={ startAngle }
                        eAngle={ endAngle }
                        direction={ 'reverse' }
                        >
                        <StyleFeature
                            annotation={annotation}
                            color={ annotation.color }
                            >
                            <CircularFeature
                                key={ 'feature' + index }
                                radius={ annotationRadius }
                                annotationHeight={ annotationHeight }
                                totalAngle={ totalAngle }
                                >
                            </CircularFeature>
                        </StyleFeature>
                    </PositionAnnotationOnCircle>
                </g>
            </div>
        )
    })
    return {
        component: <g className='veFeatures' key='veFeatures'>
            {svgGroup}
        </g>,
        height: (maxYOffset + 1) * totalAnnotationHeight,
        labels
    }
}

