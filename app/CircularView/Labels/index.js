import polarToSpecialCartesian from '../utils/polarToSpecialCartesian';
import relaxLabelAngles from './relaxLabelAngles';
import React from 'react';

function getHeightAndWidthOfLabel(text, fontWidth, fontHeight) {
    return {
        height: fontHeight,
        width: text.length * fontWidth
    }
}

function LabelGroup ({label, ...rest}) {
    var {labels: sublabels = []} = label;
    var labelIds = {};
    sublabels.forEach((label) => {labelIds[label.id] = true});
    // var multipleLabels = sublabels.length > 1;
    var multipleLabels = false;

    return (
        //wrap the entire label group in a HoverHelper
        <g 
            mouseAware={true}
            id={labelIds}
            >
            <DrawLabelGroup 
                {...{
                    label, 
                    ...rest, 
                    className: 'DrawLabelGroup', 
                    multipleLabels, 
                    sublabels, 
                    labelIds
                }}
                />
        </g>
    )
}

function DrawLabelGroup (props) {
    var {
        label, 
        sublabels, 
        fontWidth, 
        fontHeight, 
        outerRadius, 
        hoveredId, 
        labelIds, 
        multipleLabels, 
        ...rest
    } = props;

    var {text} = label;
    var maxLabelLength;
    var labelLength = text.length * (fontWidth -2);
    var maxLabelWidth = maxLabelLength * fontWidth;
    var labelXStart = label.x - (label.x < 0 ? labelLength : 0);
    var dy = 12;
    var textYStart = label.y + dy/2;
    var content;
    var labelClass;
    var line = LabelLine([label.innerPoint, label], {style: {opacity: 1}});
    var labelYStart = label.y;
    var labelGroupHeight = sublabels.length * dy;
    var labelGroupBottom = label.y + labelGroupHeight;

    // if (label.labels.length > 1) {
    //     text +=' +' + label.labels.length
    // }

    maxLabelLength = sublabels.reduce(function (currentLength, {text}) {
        if (text.length > currentLength) {
            return text.length
        } 
        return currentLength
    }, 0)

    // check if we're drawin multiple or single laels
    if(multipleLabels) {

        if (labelGroupBottom > (outerRadius+10)) {
            var diff = labelGroupBottom - (outerRadius+10)
            //calculate new label y start if necessary (the group is too long)
            labelYStart -= diff
            if (labelYStart < -outerRadius) {
            //we need to make another row of labels!
            // this hasn't been implemented yet {{}}
            }    
        }
        var labelClass = "velabelText veCircularViewLabelText clickable "

        content = [
            line,
            <g id = 'labelGroup' key='gGroup'>
                <rect 
                    x = {labelXStart-4 } 
                    y = {labelYStart-dy/2} 
                    width = {maxLabelWidth} 
                    height = {labelGroupHeight + 4} 
                    fill = 'white'
                    stroke = 'black'
                    >
                </rect>
                <text
                    x={ labelXStart }
                    y={ labelYStart }
                    style={{ fontSize: fontHeight }}
                    >
                    {sublabels.map(function (label, index) {
                        return (
                            <tspan 
                                x = { labelXStart } 
                                onClick = { label.onClick }
                                dy = { index === 0 ? dy/2 : dy } 
                                style = {{ fill: label.color ? label.color : 'black' }} 
                                className={ labelClass + label.className }
                                >
                                { label.text }
                            </tspan>
                        )
                    })}
                </text>
            </g>
        ]

    } else {
        //DRAW A SINGLE LABEL
        content = [
            <text
                key='text'
                x={labelXStart}
                className={ labelClass + label.className }
                y={textYStart}
                style={{ fill: 'black', fontSize: fontWidth }}
                >
                { text }
            </text>, 
            LabelLine([label.innerPoint, label])
        ]
    }
       
    return 
        <g 
            {...{...
                rest, 
                onClick: label.onClick
            }}
            >
            { content }
        </g>
}

function LabelLine(pointArray) {
    var points =''
    pointArray.forEach(function({x,y}){
        points+= `${x},${y} `
    });

    return <polyline {... {
            key: 'polyline',
            points, 
            stroke:'black',
            fill: 'none',
            strokeWidth: .25,
            className: 'veLabelLine',
        }}
    />
}

export default function Labels({labels={}, outerRadius}) {
    var radius = outerRadius;
    var outerPointRadius = outerRadius - 20;
    var fontWidth = 8 * outerRadius/120;
    var fontHeight = fontWidth * 1.5;
    var labelPoints = Object.keys(labels).map(function (key, index) {
        var label = labels[key];
        var {annotationCenterAngle, annotationCenterRadius} = label

        return {
            ...label,
            ...getHeightAndWidthOfLabel(label.text, fontWidth, fontHeight),
            //three points define the label:
            innerPoint: {
                ...polarToSpecialCartesian(annotationCenterRadius, annotationCenterAngle),
                radius: annotationCenterRadius,
                angle: annotationCenterAngle,
            },
            outerPoint: {
                ...polarToSpecialCartesian(outerPointRadius, annotationCenterAngle),
                radius: outerPointRadius,
                angle: annotationCenterAngle,
            },
            ...polarToSpecialCartesian(radius, annotationCenterAngle),
            radius,
            angle: annotationCenterAngle,
        }
    });
    var groupedLabels = relaxLabelAngles(labelPoints, fontHeight);

    return 
        <g 
            key={'veLabels'}
            className='veLabels'
            >
            { groupedLabels.map(function (label) {
                return LabelGroup({
                    label,
                    fontWidth,
                    fontHeight,
                    outerRadius
                })
            }) }
            <use style={{pointerEvents: 'none'}} xlinkHref="#topLevelLabels"/>
        </g>
}