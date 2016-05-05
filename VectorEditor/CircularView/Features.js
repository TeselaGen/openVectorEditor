import HoverHelper from '../HoverHelper';
import StyleFeature from './StyleFeature';
import CircularFeature from './CircularFeature';
import drawCircularLabel2 from './drawCircularLabel2';
import intervalTree2 from 'interval-tree2';
import getRangeAngles from './getRangeAnglesSpecial';

import getYOffset from './getYOffset';
import lruMemoize from 'lru-memoize';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React, { PropTypes } from 'react';
import noop from 'lodash/noop';

function Features({radius, namespace='', featureClicked=noop, features=[],annotationHeight, spaceBetweenAnnotations=2, sequenceLength}) {
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
        
        // //console.log('startAngle: ' + JSON.stringify(toDegrees(startAngle),null,4));
        // //console.log('endAngle: ' + JSON.stringify(toDegrees(endAngle),null,4));
        // //console.log('spansOrigin: ' + JSON.stringify(spansOrigin,null,4));
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
        //check if annotation name will fit
        var labelAngle = annotation.name.length * 9 / annotationRadius
        labelFits =  labelAngle < totalAngle
        // if (!labelFits) {
            // //console.log('label does not fit');
        //     //if the label doesn't fit within the annotation, draw it to the side
            // //console.log('expandedEndAngle: ' + JSON.stringify(toDegrees(expandedEndAngle),null,4));
            // //console.log('labelAngle: ' + JSON.stringify(toDegrees(labelAngle),null,4));
        //     expandedEndAngle += labelAngle //expand the end angle because we're treating the label as part of the annotation
            // //console.log('expandedEndAngle: ' + JSON.stringify(toDegrees(expandedEndAngle),null,4));
        //     //calculate the new center angle of the label
        //     labelCenter = endAngle + labelAngle/2
        //     //and calculate a new y offset
        //     //we need to check both locations to account for annotations that span the origin
        //     yOffset1 = getYOffset(featureITree, startAngle, expandedEndAngle)
        //     yOffset2 = getYOffset(featureITree, startAngle + Math.PI * 2, expandedEndAngle + Math.PI * 2)
        //     annotationCopy.yOffset = Math.max(yOffset1, yOffset2)
        // }
        // //console.log('annotationCopy.yOffset: ' + JSON.stringify(annotationCopy.yOffset,null,4));
        //calculate the radius again
        // annotationRadius = radius + annotationCopy.yOffset*annotationHeight
        // //console.log('annotationRadius: ' + JSON.stringify(annotationRadius,null,4));
        //calculate the (potentially new) labelCenter

        // if (yOffset > 5) {
        //     //don't push the annotation onto the pile
        //     return 
        // }
        if (!labelFits ){
            labels[annotation.id] ={
                annotationCenterAngle: centerAngle,
                annotationCenterRadius: annotationRadius,
                text: annotation.name,
                id: annotation.id,
                className: 'veFeatureLabel',
                onClick
            }
        }
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
            <HoverHelper 
                namespace={namespace}
                id={annotation.id}
                key={'Features'+index}
                onClick={onClick}>
                <g className='Features clickable'>
                    <PositionAnnotationOnCircle
                      key={ 'feature' + index }
                      sAngle={ startAngle }
                      eAngle={ endAngle }
                      direction={ 'reverse' }>
                      <StyleFeature
                        annotation={annotation}
                        color={ annotation.color }>
                        <CircularFeature
                            key={ 'feature' + index }
                          radius={ annotationRadius }
                          annotationHeight={ annotationHeight }
                          totalAngle={ totalAngle }>
                        </CircularFeature>
                      </StyleFeature>
                    </PositionAnnotationOnCircle>
                    {labelFits && <PositionAnnotationOnCircle
                        key={ 'inlineLabel' + index }
                      sAngle={ labelCenter + Math.PI } //add PI because drawCircularLabel is drawing 180
                      eAngle={ labelCenter + Math.PI }
                      >
                        {drawCircularLabel2({
                            centerAngle: labelCenter, //used to flip label if necessary
                            radius: annotationRadius, 
                            height: annotationHeight, 
                            text: annotation.name, 
                            id: annotation.id
                        })}
                    </PositionAnnotationOnCircle>}
                </g>
            </HoverHelper>
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

export default lruMemoize(5,undefined,true)(Features)

