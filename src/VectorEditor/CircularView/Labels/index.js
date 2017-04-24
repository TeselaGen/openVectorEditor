import polarToSpecialCartesian from '../utils/polarToSpecialCartesian';
// import relaxLabels from './relaxLabels';
import relaxLabelAngles from './relaxLabelAngles';
import deepEqual from 'deep-equal';
import './style.scss';
import lruMemoize  from 'lru-memoize'
import React from 'react'

function getHeightAndWidthOfLabel(text, fontWidth, fontHeight) {
  return {
    height: fontHeight,
    width: text.length * fontWidth
  }
}

function Labels({
    labels={},
    HoverHelper,
    outerRadius,
    condenseOverflowingXLabels=true, //set to true to make labels tha
    /*radius*/
    }) {
  outerRadius += 25
  var radius = outerRadius
  var outerPointRadius = outerRadius - 35

  var fontWidth = 8
  var fontHeight = fontWidth * 1.5

  var labelPoints = Object.keys(labels).map(function (key) {
    var label = labels[key]
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
      radius: radius + 10,
      angle: annotationCenterAngle,
    }
  }).map(function (label) {
    label.labelAndSublabels = [label]
    return label
  })


  var groupedLabels = relaxLabelAngles(labelPoints, fontHeight, outerRadius)
  return {component: <g
        key={'veLabels'}
        className='veLabels monospaceFont'>
        {groupedLabels.map(function (label,index) {
          return LabelGroup({
            label,
            labelAndSublabels: label.labelAndSublabels,
            key: index,
            fontWidth,
            fontHeight,
            HoverHelper,
            condenseOverflowingXLabels,
            outerRadius
          })
        })
        //we use the <use> tag to position the hovered label group at the top of the stack
        //point events: none is to fix a click bug..
        //http://stackoverflow.com/questions/24078524/svg-click-events-not-firing-bubbling-when-using-use-element
      }
        <use style={{pointerEvents: 'none'}} xlinkHref="#topLevelHomie"/>
    </g>,
    height: 120
  }
}
export default lruMemoize(5, deepEqual)(Labels)

function LabelGroup ({label, HoverHelper, key, ...rest}) {
  var {labelAndSublabels} = label
  var labelIds = {}
  labelAndSublabels.forEach((label) => {labelIds[label.id] = true})
  var multipleLabels = labelAndSublabels.length > 1
  return (
    //wrap the entire label group in a HoverHelper
    <HoverHelper
            mouseAware={true}
            key={key}
            id={labelIds}>
      <DrawLabelGroup
        key={key}
        {...{label, HoverHelper, ...rest, className: 'DrawLabelGroup', multipleLabels, labelAndSublabels, labelIds}}/>
    </HoverHelper>
  )
}


function DrawLabelGroup (props) {
  var {label, labelAndSublabels, HoverHelper, fontWidth, fontHeight, outerRadius, condenseOverflowingXLabels, hoveredId, labelIds, multipleLabels, hovered, isIdHashmap, ...rest} = props
  var {text} = label;
  var groupLabelXStart

  //Add the number of unshown labels
  if (label.labelAndSublabels && label.labelAndSublabels.length > 1) {
    // if (label.x > 0) {
      text ='+' + (label.labelAndSublabels.length - 1) + ',' + text
    // } else {
    //   text += ', +' + (label.labelAndSublabels.length - 1)
    // }
  }

  var labelLength = text.length * fontWidth
  var maxLabelLength = labelAndSublabels.reduce(function (currentLength, {text}) {
    if (text.length > currentLength) {
      return text.length
    }
    return currentLength
  }, 0)

  var maxLabelWidth = maxLabelLength * fontWidth
  var labelOnLeft = label.x < 0
  var labelXStart = label.x - (labelOnLeft ? labelLength : 0)
    //we're on the left side of the circle
  if (condenseOverflowingXLabels) {
    var distancePastBoundary = Math.abs(label.x + (labelOnLeft ? -labelLength : labelLength)) - (outerRadius + 90)
    if (distancePastBoundary > 0) {
      var numberOfCharsToChop = Math.ceil(distancePastBoundary / fontWidth) + 3
    //   if (numberOfCharsToChop > text.length) numberOfCharsToChop = text.length
      //label overflows the boundaries!
      text = text.slice(0,-numberOfCharsToChop) + '...'
      groupLabelXStart = labelXStart + (labelOnLeft ? distancePastBoundary : -distancePastBoundary)
      labelXStart += labelOnLeft ? (distancePastBoundary) : 0
    }
  }
  var dy = 20;
  var textYStart = label.y + dy/2

  //if label xStart or label xEnd don't fit within the canvas, we need to shorten the label..

  var content
  var labelClass = "velabelText veCircularViewLabelText clickable "

  if ((multipleLabels || groupLabelXStart !== undefined) && hovered) {
    //HOVERED: DRAW MULTIPLE LABELS IN A RECTANGLE
    var hoveredLabel
    if (groupLabelXStart !== undefined) {
      labelXStart = groupLabelXStart
    }
    labelAndSublabels.some(function (label) {
      if (label.id === hoveredId) {
        hoveredLabel = label
        return true
      }
    })
    if (!hoveredLabel) {
      hoveredLabel = label
    }
    var labelYStart = label.y

    var labelGroupHeight = labelAndSublabels.length * dy
    var labelGroupBottom = label.y + labelGroupHeight
    // var numberOfLabelsToFitAbove = 0
    if (labelGroupBottom > (outerRadius+10)) {
      // var diff = labelGroupBottom - (outerRadius+10)
      //calculate new label y start if necessary (the group is too long)
      labelYStart-= (label.labelAndSublabels.length - 1) * dy
      if (labelYStart < -outerRadius) {
        //we need to make another row of labels!

      }
    }

    var line = LabelLine([hoveredLabel.innerPoint, hoveredLabel.labelAndSublabels && hoveredLabel.labelAndSublabels.length > 0 ? hoveredLabel.outerPoint : {}, label], {style: {opacity: 1}})
    content = [
        line,
        <g id='topLevelHomie' key='gGroup'>
          <rect
            x={labelXStart-4 }
            y={labelYStart-dy/2}
            width={maxLabelWidth + 10}
            height={labelGroupHeight + 4}
            fill='white'
            stroke='black'
            >
          </rect>
          <text
              x={labelXStart}
              y={labelYStart}
              style={{} }>
                {labelAndSublabels.map(function (label, index) {
                  return (
                    <HoverHelper
                      key={'labelItem' + index}
                      doNotTriggerOnMouseOut
                      id={label.id}
                      passJustOnMouseOverAndClassname
                      >
                      <tspan
                        x={labelXStart}
                        textLength={label.text.length * fontWidth}
                        lengthAdjust="spacing"
                        onClick={label.onClick}
                        dy={index === 0 ? dy/2 : dy}
                        style={{fill: label.color ? label.color : 'black'}}
                        className={labelClass + label.className}>
                      {label.text}
                      </tspan>
                    </HoverHelper>
                  )
                })}
            </text>
        </g>
    ]
  } else {
    //DRAW A SINGLE LABEL
    content = [
        <title key='labeltitle'>{label.text}</title>,
        <text
          key='text'
          x={labelXStart}
          textLength={text.length * fontWidth}
          lengthAdjust="spacing"
          className={labelClass + label.className + (hovered ? ' veAnnotationHovered' : '')}
          y={textYStart}
          style={ { fill: label.color ? label.color : 'black'}   }>
          {text}
        </text>,
        LabelLine([label.innerPoint, label.outerPoint, label], hovered ? {style: {opacity: 1}} : {})
    ]
  }
  return <g {...{...rest, onClick: label.onClick}}>
    {content}
  </g>
}

function LabelLine(pointArray,options) {
  var points =''
  pointArray.forEach(function({x,y}){
      if (!x) return
      points+= `${x},${y} `
  });
  return <polyline {... {
      key: 'polyline',
      points,
      stroke:'black',
      fill: 'none',
      strokeWidth:1,
      style: {
        opacity: .4
      },
      className: 'veLabelLine',
      ...options
    }
  }
  />
}
