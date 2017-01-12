import StyleFeature from './StyleFeature';
import CircularFeature from './CircularFeature';
import intervalTree2 from 'interval-tree2';
import getRangeAngles from './getRangeAnglesSpecial';
import getYOffset from './getYOffset';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React from 'react';
import noop from 'lodash/utility/noop';

export default function Features({radius, features=[], annotationHeight, spaceBetweenAnnotations=2, sequenceLength, signals}) {
    //console.log('RENDERING FEATURES');
    var totalAnnotationHeight = annotationHeight + spaceBetweenAnnotations;
    var featureITree = new intervalTree2(Math.PI)
    var maxYOffset = 0
    var svgGroup = []
    var labels = {}
    Object.keys(features).reverse().forEach(function(key, index) {
        var annotation = features[key]  
        var annotationCopy = {...annotation}
        var annotationRadius
        var {startAngle, endAngle, totalAngle, centerAngle} = getRangeAngles(annotation, sequenceLength);
        var spansOrigin = startAngle > endAngle;
        var labelCenter = centerAngle;
        //expand the end angle if annotation spans the origin
        var expandedEndAngle = spansOrigin ? endAngle + 2 * Math.PI : endAngle
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

        // add label info to labels
        labels[annotation.id] ={
            annotationCenterAngle: centerAngle,
            annotationCenterRadius: annotationRadius,
            text: annotation.name,
            id: annotation.id,
            className: 'veFeatureLabel'
        }

        svgGroup.push(
            <g 
                id={annotation.id}
                key={'Features' + index}
                >
                <g className='Features clickable'>
                    <PositionAnnotationOnCircle
                        key={ 'feature' + index }
                        sAngle={ startAngle }
                        eAngle={ endAngle }
                        direction={ 'reverse' } // buh {{}}
                        >
                        <StyleFeature
                            annotation={ annotation }
                            color={ annotation.color }
                            signals = { signals }
                            >
                            <CircularFeature
                                color={ annotation.color }
                                key={ 'feature' + index }
                                radius={ annotationRadius }
                                annotationHeight={ annotationHeight }
                                totalAngle={ totalAngle }
                                forward={ annotation.forward }
                                >
                            </CircularFeature>
                        </StyleFeature>                            
                    </PositionAnnotationOnCircle>                  
                </g>
            </g>
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

