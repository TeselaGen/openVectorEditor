import polarToSpecialCartesian from '../utils/polarToSpecialCartesian';
import relaxLabelAngles from './relaxLabelAngles';
import React from 'react';

function getHeightAndWidthOfLabel(text, fontWidth, fontHeight) {
    return {
        height: fontHeight,
        width: text.length * fontWidth
    }
}

export default function Labels({labels={}, outerRadius}) {
    var radius = outerRadius;
    var outerPointRadius = outerRadius - 20;
    var fontWidth = 6;
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
    var groupedLabels = relaxLabelAngles(labelPoints, fontHeight)

    return <g
        key={'veLabels'}
        className='veLabels'>
        {groupedLabels.map(function (label) {
            return LabelGroup({
                label,
                fontWidth,
                fontHeight,
                outerRadius
            })
        })
        //we use the <use> tag to position the hovered label group at the top of the stack
        //point events: none is to fix a click bug..
        //http://stackoverflow.com/questions/24078524/svg-click-events-not-firing-bubbling-when-using-use-element
        }
        <use style={{pointerEvents: 'none'}} xlinkHref="#topLevelLabels"/>
    </g>
}


function LabelGroup ({label, ...rest}) {
    var {labels: sublabels = []} = label;
    var labelIds = {};
    sublabels.forEach((label) => {labelIds[label.id] = true});
    var multipleLabels = sublabels.length > 1;

    return (
        <g
            mouseAware={true}
            key={label.id}
            id={label.id}
            >
            <DrawLabelGroup
                {...{label, ...rest, className: 'DrawLabelGroup', sublabels, multipleLabels, labelIds}}
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
        labelIds,
        multipleLabels,
        ...rest
    } = props;

    var {text} = label;
    var maxLabelLength;
    var labelLength = text.length * (fontWidth - 2);
    var maxLabelWidth;
    var labelXStart = label.x - (label.x < 0 ? labelLength : 0);
    var dy = fontHeight;
    var content;
    var labelClass = "velabelText veCircularViewLabelText clickable ";
    var line = LabelLine([label.innerPoint, label], {style: {opacity: 1}});
    var labelYStart = label.y;
    var labelGroupHeight = sublabels.length * dy;
    var labelGroupBottom = label.y + labelGroupHeight;

    maxLabelLength = sublabels.reduce(function (currentLength, {text}) {
        if (text.length > currentLength) {
            return text.length
        }
        return currentLength
    }, 0)
    maxLabelWidth = maxLabelLength * fontWidth;

    if (multipleLabels) {
        // DRAW MULTIPLE LABELS
        var labelYStart = label.y
        var labelGroupHeight = sublabels.length * dy
        var labelGroupBottom = label.y + labelGroupHeight
        if (labelGroupBottom > (outerRadius+10)) {
          var diff = labelGroupBottom - (outerRadius+10)
          //calculate new label y start if necessary (the group is too long)
          labelYStart -= diff
          if (labelYStart < outerRadius * -1) {
            //we need to make another row of labels!
            // {{}} this is not yet implemented, does it need to be?

          }
        }
        var labelClass = "velabelText veCircularViewLabelText clickable "

        var line = LabelLine([label.innerPoint, label], {style: {opacity: 1}})
        content = [
            line,
            <g id='topLevelLabels' key='gGroup'>
                { sublabels.map(function (label, index) {
                    var flipLabel = 1;
                    if (labelYStart < 0) { // we're on the top half of the circle
                        flipLabel = -1; // stack labels up not down
                    }
                    return (
                        <text
                            key = 'text'
                            x = { labelXStart }
                            onClick = { label.handleClick() }
                            dy = { index === 0 ? 0 : dy * index * flipLabel }
                            style = {{ fill: label.color, fontSize: fontWidth }}
                            className = { labelClass + label.className }
                            y = { labelYStart }
                            >
                            { label.text }
                        </text>
                    )
                })}
            </g>
        ]
    } else {
        //DRAW A SINGLE LABEL
        content = [
            <text
                key = 'text'
                x = { labelXStart }
                onClick = { label.handleClick() }
                className = { labelClass + label.className }
                y = { labelYStart }
                style = {{ fill: label.color, fontSize: fontWidth }}
                >
                { text }
            </text>,
            LabelLine([label.innerPoint, label])
        ]
    }

    return <g {...{...rest}}>
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
