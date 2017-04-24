import VeWarning from '../VeWarning';
import getRangeLength from 've-range-utils/getRangeLength'
import PassThrough from '../utils/PassThrough'
import _Labels from './Labels';
import _SelectionLayer from './SelectionLayer';
import _Caret from './Caret';
import _Axis from './Axis';
import LineageLines from './LineageLines';
import _Orfs from './Orfs';
import _Features from './Features';
import _Primers from './Primers';
import DeletionLayers from './DeletionLayers';
import ReplacementLayers from './ReplacementLayers';
import _Cutsites from './Cutsites';
import sortBy from 'lodash/sortBy'
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import getAngleForPositionMidpoint from './getAngleForPositionMidpoint';
import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';
import getPositionFromAngle from 've-range-utils/getPositionFromAngle';
import React from 'react';
import Draggable from 'react-draggable';
import './style.scss';
import draggableClassnames from '../constants/draggableClassnames';

function noop() {
}

// function toDegrees(radians) {
//     return radians / 2 / Math.PI * 360
// }

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
        
        callback({
            className: event.target.className.animVal,
            shiftHeld: event.shiftKey,
            nearestCaretPos,
            selectionStartGrabbed: event.target.classList.contains(draggableClassnames.selectionStart),
            selectionEndGrabbed: event.target.classList.contains(draggableClassnames.selectionEnd),
            
        })
    }

    render() {
        var propsToUse = {...this.props.veWrapperProvidedProps, ...this.props}
        var {
            //set defaults for all of these vars
            width= 400,
            height= 400,
            scale=1,
            centerText,
            sequenceData = {
              features: {},
              primers: {},
              orfs: {},
              sequence: 'atgc',
              cutsites: {},
            },
            hideName = false,
            HoverHelper=PassThrough,
            selectionLayer = {start: -1, end: -1},
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
            primerClicked = noop,
            deletionLayerClicked = noop,
            replacementLayerClicked = noop,
            orfClicked = noop,
            cutsiteClicked = noop,
            featureOptions={},
            additionalSelectionLayers=[],
            componentOverrides={},
            maxAnnotationsToDisplay= {
              
            },
            lineageLines=[],
            deletionLayers = {},
            replacementLayers = {},
            // modifyLayers = function (layers) {
            //   return layers
            // },
        } = propsToUse;
        var {
                Labels = _Labels,
                SelectionLayer = _SelectionLayer,
                Caret = _Caret,
                Axis = _Axis,
                Features = _Features,
                Primers = _Primers,
                Orfs = _Orfs,
                Cutsites = _Cutsites,
        } = componentOverrides

        var {sequence = 'atgc'} = sequenceData
        var sequenceLength = sequence
        var sequenceName = hideName ? "" : sequenceData.name || ""
        circularAndLinearTickSpacing = circularAndLinearTickSpacing
            || (sequenceLength < 10
                ? 1
                : sequenceLength < 50
                    ? Math.ceil(sequenceLength / 5)
                    : Math.ceil(sequenceLength / 100) * 10)
        var {
            features: showFeatures = true,
            primers: showPrimers = true,
            // translations: showTranslations = true,
            // parts: showParts = true,
            orfs: showOrfs = true,
            cutsites: showCutsites = true,
            // firstCut: showFirstCut = true,
            axis: showAxis = true,
            lineageLines: showLineageLines = true,
            axisNumbers: showAxisNumbers = false,
            // sequence: showSequence = true,
            // reverseSequence: showReverseSequence = true,
        } = annotationVisibility
        var {
            features: maxFeaturesToDisplay = 50,
            primers: maxPrimersToDisplay = 50,
            // translations: maxTranslationsToDisplay = 50,
            // parts: maxPartsToDisplay = 50,
            orfs: maxOrfsToDisplay = 50,
            cutsites: maxCutsitesToDisplay = 100,
        } = maxAnnotationsToDisplay
        var paredDownOrfs
        var paredDownCutsites
        var paredDownFeatures
        var paredDownPrimers
        

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

        var layersToDraw = [
          {layer: drawSequenceChars, zIndex: 10, layerName: 'SequenceChars'},
          {layer: drawFeatures, zIndex: 20, layerName: 'Features'},
          {layer: drawPrimers, zIndex: 20, layerName: 'Primers'},
          {layer: drawCaret, zIndex: 15, layerName: 'Caret'},
          {layer: drawSelectionLayer, zIndex: 10, layerName: 'SelectionLayer'},
          {layer: drawAxis, zIndex: 0, layerName: 'Axis', spaceBefore: 0, spaceAfter: 0},
          {layer: drawReplacementLayers, zIndex: 20, layerName: 'ReplacementLayers', spaceAfter: 20},
          {layer: drawDeletionLayers, zIndex: 20, layerName: 'DeletionLayers', spaceAfter: 20},
          {layer: drawLineageLines, zIndex: 0, layerName: 'LineageLines'},
          {layer: drawCutsites, zIndex: 10, layerName: 'Cutsites'},
          {layer: drawOrfs, zIndex: 20, layerName: 'Orfs',spaceBefore: 10},
          {layer: drawLabels, zIndex: 30, layerName: 'Labels'},
        ]

        var output = layersToDraw.map(function({layer,
            // layerName,
            spaceBefore=0,
            spaceAfter=0,
            zIndex}) {
        //   console.warn('-------------------------------------')
        //   console.warn('layerName:',JSON.stringify(layerName,null,4))
        //   console.warn('radius before draw:',JSON.stringify(radius,null,4))
          radius+=spaceBefore
          var result = layer()
          if (!result) return null
          radius+=spaceAfter
          // console.warn('radius after draw:',JSON.stringify(radius,null,4))
          return {
            result,
            // layer({
            //   radius,
            //   baseRadius,
            //   innerRadius,
            //   labels,
            //   annotationsSvgs,
            // }),
            zIndex
          }
        }).filter(function (i) {return !!i})
        annotationsSvgs = sortBy(output, 'zIndex').reduce(function (arr, {result}) {
            return arr.concat(result)
        },[])

        //debug hash marks
        // annotationsSvgs = annotationsSvgs.concat([0,50,100,150,190].map(function (pos) {
        //     return <text key={pos} transform={`translate(0,${-pos})`}>{pos}</text>
        // }))

        function drawFeatures() {
          //DRAW FEATURES
          if (showFeatures) {
            var [annotationsToPass, paredDown] = pareDownAnnotations(sequenceData.features, maxFeaturesToDisplay)
            paredDownFeatures = paredDown
            var results = Features({
                radius,
                featureClicked,
                features: annotationsToPass,
                annotationHeight,
                spaceBetweenAnnotations,
                sequenceLength,
                HoverHelper,
                ...featureOptions,
            })
            //update the radius, labels, and svg
            radius+= results.height
            labels = {...labels, ...results.labels}
            return results.component
          }
        }

        function drawPrimers() {
          //DRAW FEATURES
          if (showPrimers) {
            var [annotationsToPass, paredDown] = pareDownAnnotations(sequenceData.primers, maxPrimersToDisplay)
            paredDownPrimers = paredDown
            var results = Primers({
                radius,
                primerClicked,
                primers: annotationsToPass,
                annotationHeight,
                spaceBetweenAnnotations,
                sequenceLength,
                HoverHelper,
            })
            //update the radius, labels, and svg
            radius+= results.height
            labels = {...labels, ...results.labels}
            return results.component
          }
        }

        function drawDeletionLayers() {
          var results = DeletionLayers({
              radius,
              deletionLayerClicked,
              deletionLayers,
              annotationHeight,
              spaceBetweenAnnotations,
              sequenceLength,
              HoverHelper,
          })
          if (!results) return null
          //update the radius, labels, and svg
          radius+= results.height
          labels = {...labels, ...results.labels}
          return results.component
        }

        function drawReplacementLayers() {
          var results = ReplacementLayers({
              radius,
              replacementLayerClicked,
              replacementLayers,
              annotationHeight,
              spaceBetweenAnnotations,
              sequenceLength,
              HoverHelper,
          })
          if (!results) return null
          //update the radius, labels, and svg
          radius+= results.height
          labels = {...labels, ...results.labels}
          return results.component
        }

        function drawOrfs() {
          //DRAW FEATURES
          if (showOrfs) {
              var [annotationsToPass, paredDown] = pareDownAnnotations(sequenceData.orfs, maxOrfsToDisplay)
              paredDownOrfs = paredDown
              var results = Orfs({
                  radius,
                  orfClicked,
                  orfs: annotationsToPass,
                  annotationHeight,
                  spaceBetweenAnnotations,
                  sequenceLength,
                  HoverHelper,
                  ...featureOptions,
              })
              //update the radius, labels, and svg
              radius+= results.height
              labels = {...labels, ...results.labels}
              return results.component
          }
        }

        function drawSequenceChars() {
          //DRAW CHARS (only if there are fewer than 85 of them)
          if (sequenceLength < 85) {
              radius+=25;
              sequenceData.sequence.split('').forEach(function(bp, index) {
                  var tickAngle = getAngleForPositionMidpoint(index, sequenceLength);
                  return <PositionAnnotationOnCircle
                        key={ index }
                        sAngle={ tickAngle }
                        eAngle={ tickAngle }
                        height={ radius }>
                        <text
                          transform={`rotate(180)` }
                          style={ {    textAnchor: "middle",    dominantBaseline: "central",    fontSize: 'small'} }>
                          { bp }
                        </text>
                      </PositionAnnotationOnCircle>
              })
          }
        }

        function drawAxis() {
          if (showAxis) {
            var axisResult = Axis({
              showAxisNumbers,
              radius: radius,
              sequenceLength,
              circularAndLinearTickSpacing,
            })
            //update the radius, and svg
            radius+= axisResult.height
            return axisResult.component
          }
        }
        
        function drawLineageLines() {
          if (showLineageLines) {
            var result = LineageLines({
              radius: radius,
              sequenceLength,
              annotationHeight: 6,
              HoverHelper,
              lineageLines,
              // lineageLines: [{start: 10, end:2000,},{start: 201, end:9,}],
            })
            //update the radius, and svg
            radius+= result.height
            return result.component
          }
        }

        function drawCutsites() {
          //DRAW CUTSITES
          if (showCutsites) {
            var [annotationsToPass, paredDown] = pareDownAnnotations(sequenceData.cutsites, maxCutsitesToDisplay)
            paredDownCutsites = paredDown
            var cutsiteResults = Cutsites({
              cutsites: annotationsToPass,
              radius,
              annotationHeight,
              sequenceLength,
              HoverHelper,
              cutsiteClicked,
            })
            //update the radius, labels, and svg
            radius+= cutsiteResults.height
            labels = {...labels, ...cutsiteResults.labels}
            return cutsiteResults.component
          }
        }

        function drawSelectionLayer() {
          //DRAW SELECTION LAYER
          var selectionLayers = [
              ...additionalSelectionLayers,
              ...Array.isArray(selectionLayer)
              ? selectionLayer
              : [selectionLayer]
          ]
          return selectionLayers.map(function (selectionLayer, index) {
            if (selectionLayer.start >= 0 && selectionLayer.end >= 0 && sequenceLength > 0) {
              return SelectionLayer({
                index,
                selectionLayer,
                sequenceLength,
                baseRadius: baseRadius,
                radius: radius,
                innerRadius
              })
            }
          })
        }

        function drawCaret() {
          //DRAW CARET
          if (caretPosition !== -1 && selectionLayer.start < 0 && sequenceLength > 0) { //only render if there is no selection layer
            return <Caret {
                    ...{
                      caretPosition,
                      sequenceLength,
                      innerRadius,
                      outerRadius: radius
                    }
                  }
              />

          }
        }

        function drawLabels() {
          var res = Labels({HoverHelper, labels, outerRadius: radius})
          radius+=res.height
          return res.component
        }
        
        return (
            <div tabIndex='0' className={'veCircularView'}>
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
              <div>
                <div 
                  key='circViewSvgCenterText'
                  className={'veCircularViewMiddleOfVectorText'}
                  style={{width: innerRadius, textAlign: 'center'}}>
                  <span>{sequenceName} </span>
                  <br/>
                  <span>{sequenceLength + ' bps'}</span>
                </div>
                <svg
                  key='circViewSvg'
                  onClick={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, sequenceLength, editorClicked)}
                  }
                  style={{overflow: 'visible'}}
                  width={ width }
                  height={ height }
                  ref="circularView"
                  className={'circularViewSvg'}
                  viewBox={ `-${radius*scale} -${radius*scale} ${radius*2*scale} ${radius*2*scale}` }
                  >
                  { annotationsSvgs }
                </svg>
                <div className={'veCircularViewWarningContainer1'}>
                  {paredDownOrfs && <VeWarning message={`Warning: More than ${maxOrfsToDisplay} Open Reading Frames. Displaying only the largest ${maxOrfsToDisplay}`}/>}
                  {paredDownCutsites && <VeWarning message={`Only the first ${maxCutsitesToDisplay} cut sites will be displayed. Filter the display by cut site by selecting your desired Restriction Enzyme type `}/>}
                  {paredDownFeatures && <VeWarning message={`Warning: More than ${maxFeaturesToDisplay} Features. Displaying only the largest ${maxFeaturesToDisplay}`}/>}
                  {paredDownPrimers && <VeWarning message={`Warning: More than ${maxPrimersToDisplay} Primers. Displaying only the largest ${maxPrimersToDisplay}`}/>}
                </div>
              </div>
              </Draggable>
            </div>
            );
    }
}

function pareDownAnnotations(annotations, max) {
  var annotationsToPass = annotations
  var paredDown = false
  if (Object.keys(annotations).length > max) {
    paredDown = true
    var sortedAnnotations = sortBy(annotations, function (annotation) {
      return -getRangeLength(annotation)
    })
    annotationsToPass = sortedAnnotations.slice(0,max).reduce(function (obj, item) {
      obj[item.id] = item
      return obj
    }, {})
  }
  return [annotationsToPass, paredDown]
}

// function (messages) {
//   messages.forEach(function ([displayMessage, message]) {
//     displayMessage && 
//   })
// }
