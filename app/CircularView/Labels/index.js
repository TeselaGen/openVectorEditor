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
            id={labelIds} // {{}} this isn't working its an object
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
    var labelLength = text.length * (fontWidth -2);
    var maxLabelWidth = maxLabelLength * fontWidth;
    var labelXStart = label.x - (label.x < 0 ? labelLength : 0);
    var dy = 12;
    var textYStart = label.y + dy/2;
    var content;
    var labelClass = "velabelText veCircularViewLabelText clickable ";
    var line = LabelLine([label.innerPoint, label], {style: {opacity: 1}});
    var labelYStart = label.y;
    var labelGroupHeight = sublabels.length * dy;
    var labelGroupBottom = label.y + labelGroupHeight;

    console.log("draw label group")
    console.log(props)

    maxLabelLength = sublabels.reduce(function (currentLength, {text}) {
        // //console.log('arguments: ', arguments);
        if (text.length > currentLength) {
            return text.length
        } 
        return currentLength
    }, 0)

    if (multipleLabels) {
        // DRAW MULTIPLE LABELS IN A RECTANGLE
        var labelYStart = label.y
        var labelGroupHeight = sublabels.length * dy
        var labelGroupBottom = label.y + labelGroupHeight
        if (labelGroupBottom > (outerRadius+10)) {
          var diff = labelGroupBottom - (outerRadius+10)
          //calculate new label y start if necessary (the group is too long)
          labelYStart-= diff
          if (labelYStart < -outerRadius) {
            //we need to make another row of labels!
            
          }
        }
        var labelClass = "velabelText veCircularViewLabelText clickable "
        
        var line = LabelLine([label.innerPoint, label], {style: {opacity: 1}})
        content = [
                    line,
                    <g id='topLevelLabels' key='gGroup'>
                      <rect 
                        x={labelXStart-4 } 
                        y={labelYStart-dy/2} 
                        width={maxLabelWidth} 
                        height={labelGroupHeight + 4} 
                        fill='white'
                        stroke='black'
                        >
                      </rect>
                      <text
                          x={labelXStart}
                          y={labelYStart}
                          style={ {fontSize: fontHeight} }>
                            {sublabels.map(function (label, index) {
                              return (
                                // <div
                                //   key={index}
                                //   id={label.id}
                                //   >
                                  <tspan 
                                    x={labelXStart} 
                                    onClick={label.onClick}
                                    dy={index === 0 ? dy/2 : dy} 
                                    style={{fill: label.color ? label.color : 'black'}} 
                                    className={labelClass + label.className}>
                                  {label.text}
                                  </tspan>
                                // </div>
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
           
    return <g {...{...rest, onClick: label.onClick}}>
            {content}
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

