let Cutsite = require('./Cutsite');
var calculateTickMarkPositionsForGivenRange = require('./calculateTickMarkPositionsForGivenRange');
var StyleFeature = require('./StyleFeature');
var arcUtils = require('./graphic-helpers/arcUtils.js');
var drawDirectedPiePiece = require('./graphic-helpers/describeArc.js');
import assign from 'lodash/object/assign'
import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-react';
import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies
var Draggable = require('react-draggable');

@Cerebral({
    rowViewDimensions: ['rowViewDimensions'],
    rowData: ['mapViewRowData'],
    charWidth: ['charWidth'],
    selectionLayer: ['selectionLayer'],
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],
    annotationHeight: ['annotationHeight'],
    tickSpacing: ['tickSpacing'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showSequence: ['showSequence'],
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    caretPosition: ['caretPosition'],
    sequenceLength: ['sequenceLength'],
    bpsPerRow: ['bpsPerRow']
})
@propTypes({
    rowViewDimensions: PropTypes.object.isRequired,
    rowData: PropTypes.array.isRequired,
    charWidth: PropTypes.number.isRequired,
    selectionLayer: PropTypes.object.isRequired,
    cutsiteLabelSelectionLayer: PropTypes.object.isRequired,
    annotationHeight: PropTypes.number.isRequired,
    tickSpacing: PropTypes.number.isRequired,
    spaceBetweenAnnotations: PropTypes.number.isRequired,
    showFeatures: PropTypes.bool.isRequired,
    showTranslations: PropTypes.bool.isRequired,
    showParts: PropTypes.bool.isRequired,
    showOrfs: PropTypes.bool.isRequired,
    showAxis: PropTypes.bool.isRequired,
    showCutsites: PropTypes.bool.isRequired,
    showReverseSequence: PropTypes.bool.isRequired,
    caretPosition: PropTypes.number.isRequired,
    sequenceLength: PropTypes.number.isRequired,
    bpsPerRow: PropTypes.number.isRequired,
    handleEditorDrag: PropTypes.func.isRequired,
    handleEditorDragStart: PropTypes.func.isRequired,
    handleEditorDragStop: PropTypes.func.isRequired,
    handleEditorClick: PropTypes.func.isRequired,
})
class CircularView extends React.Component {
    getNearestCursorPositionToMouseEvent(event, callback) {
        var rowNotFound = true;
        var visibleRowsContainer = this.refs.InfiniteScroller.getVisibleRowsContainerDomNode();
        //loop through all the rendered rows to see if the click event lands in one of them
        for (var relativeRowNumber = 0; relativeRowNumber < visibleRowsContainer.childNodes.length; relativeRowNumber++) {
            var rowDomNode = visibleRowsContainer.childNodes[relativeRowNumber];
            var boundingRowRect = rowDomNode.getBoundingClientRect();
            // console.log('boundingRowRect.top', JSON.stringify(boundingRowRect.top,null,4));
            // console.log('boundingRowRect.height', JSON.stringify(boundingRowRect.height,null,4));
            if (event.clientY > boundingRowRect.top && event.clientY < boundingRowRect.top + boundingRowRect.height) {
                //then the click is falls within this row
                // console.log('HGGGG');
                rowNotFound = false;
                var rowNumber = this.refs.InfiniteScroller.state.visibleRows[relativeRowNumber];
                var row = this.props.rowData[rowNumber];
                if (event.clientX - boundingRowRect.left < 0) {
                    console.warn('this should never be 0...');
                    callback(row.start, event); //return the first bp in the row
                } else {
                    var clickXPositionRelativeToRowContainer = event.clientX - boundingRowRect.left;
                    var numberOfBPsInFromRowStart = Math.floor((clickXPositionRelativeToRowContainer + this.props.charWidth / 2) / this.props.charWidth);
                    var nearestBP = numberOfBPsInFromRowStart + row.start;
                    if (nearestBP > row.end + 1) {
                        nearestBP = row.end + 1;
                    }
                    // console.log('nearestBP', nearestBP);
                    callback(nearestBP, event);
                }
                break; //break the for loop early because we found the row the click event landed in
            }
        }
        if (rowNotFound) {
            console.warn('was not able to find the correct row');
            //return the last bp index in the rendered rows
            var lastOfRenderedRowsNumber = this.refs.InfiniteScroller.state.visibleRows[this.refs.InfiniteScroller.state.visibleRows.length - 1];
            var lastOfRenderedRows = this.props.rowData[lastOfRenderedRowsNumber];
            callback(lastOfRenderedRows.end, event);
        }
    }

    render() {
        var {showSequence, rowViewDimensions, rowData, handleEditorDrag, handleEditorDragStart, handleEditorDragStop, handleEditorClick, charWidth, selectionLayer, cutsiteLabelSelectionLayer, annotationHeight, tickSpacing, spaceBetweenAnnotations, showFeatures, showTranslations, showParts, showOrfs, showAxis, showCutsites, showReverseSequence, caretPosition, sequenceLength, bpsPerRow, signals} = this.props;


        var rowViewStyle = {
            height: rowViewDimensions.height,
            width: rowViewDimensions.width,
        //   overflowY: "scroll",
        // float: "left",
        // paddingRight: "20px"
        //   padding: 10
        };
        // console.log('rowData: ' + JSON.stringify(rowData,null,4));
        var baseRadius = 30;

        var center = {
            x: 250,
            y: 250
        }
        var radius = 100;
        var gapBetweenAnnotations = 5;
        var totalAnnotationHeight = annotationHeight + gapBetweenAnnotations;
        var startAngle = 0;
        var endAngle = 1;
        var direction = 1;

        function getAngleStartAndEndForRange(range, sequenceLength) {
            return {
                startAngle: 2 * Math.PI * (range.start / sequenceLength),
                endAngle: 2 * Math.PI * range.end / sequenceLength
            }
        }

        var annotationsSvgs = [];
        
        // if (showFeatures) {
        //     var maxYOffset = 0;
        //     rowData[0].features.forEach(function(annotation) {
        //         var {startAngle, endAngle} = getAngleStartAndEndForRange(annotation, sequenceLength);
        //         if (annotation.yOffset > maxYOffset) maxYOffset = annotation.yOffset;
        //         var path = arcUtils.drawDirectedPiePiece(center, baseRadius + (annotationHeight + 5) * annotation.yOffset + 15, annotationHeight, startAngle, endAngle, direction)
        //         annotationsSvgs.push(
        //             <StyleFeature
        //                 onClick={function (event) {
        //                     signals.setSelectionLayer({selectionLayer: this});
        //                     event.stopPropagation();
        //                 }.bind(annotation)}
        //                 color={annotation.color}>
        //                 <path
        //                            d={ path }
        //                            fill={annotation.color} />
        //             </StyleFeature>
        //             )
        //     })
        //     baseRadius += maxYOffset + 1 * totalAnnotationHeight
        // }

        if (showFeatures) {
            var maxYOffset = 0;
            rowData[0].features.some(function(annotation) {
                var {startAngle, endAngle} = getAngleStartAndEndForRange(annotation, sequenceLength);
                if (annotation.yOffset > maxYOffset) maxYOffset = annotation.yOffset;
                // var path = arcUtils.drawDirectedPiePiece(center, baseRadius + (annotationHeight + 5) * annotation.yOffset + 15, annotationHeight, startAngle, endAngle, direction)
                var path = drawDirectedPiePiece({radius: 80, annotationHeight, widthInBps: 10, sequenceLength: 100})
                annotationsSvgs.push(
                    <StyleFeature
                        onClick={function (event) {
                            signals.setSelectionLayer({selectionLayer: this});
                            event.stopPropagation();
                        }.bind(annotation)}
                        color={annotation.color}>
                        <path
                                   d={ path.print() }
                                   fill={annotation.color} />
                    </StyleFeature>
                    )
                return true
            })
            baseRadius += maxYOffset + 1 * totalAnnotationHeight
        }
        
        if (showAxis) {
            var tickMarkHeight = 10;
            var tickMarkWidth = 1/(2*Math.PI);
            var axisLineThickness = 4;
            var outerRadius = baseRadius + 40 + tickMarkHeight + axisLineThickness

            var path = arcUtils.drawPiePiece(center, outerRadius, axisLineThickness, 0, 2*Math.PI - .00001, direction)
            var tickPositions = calculateTickMarkPositionsForGivenRange({range: {start: 0, end: sequenceLength}, tickSpacing: 30});
            var tickMarksAndLabels = tickPositions.map(function (tickPosition,index) {

                // var {startAngle, endAngle} = getAngleStartAndEndForRange({start: tickPosition, end: tickPosition}, sequenceLength);
                // var tickMarkPath = arcUtils.drawPiePiece(center, outerRadius, tickMarkHeight, startAngle, startAngle + tickMarkWidth, direction)
                //tnr: turn the following into a reusable component
                return (
                    <g
                    transform={`translate(${outerRadius},0) rotate(${tickPosition})`}
                    >
                        <text 
                            x={tickMarkWidth/2}  
                            y={tickMarkHeight + 15}
                            style={{textAnchor: "middle", fontSize: 'small'}}
                            >
                            {tickPosition}
                        </text>
                        <polyline
                            points={`0,0 ${tickMarkWidth},0 ${tickMarkWidth},${tickMarkHeight} 0,${tickMarkHeight} 0,0`}
                            strokeWidth="3"
                            stroke={'black'}
                            >
                        </polyline>                
                    </g>
                    )
            })
            annotationsSvgs.push(
                <g>
                    {tickMarksAndLabels}
                    <path
                       d={ path }
                       fill='black' />
                </g>
            )
            baseRadius += totalAnnotationHeight
        }
        // if (showAxis) {
        //     rowData[0].features.forEach(function(feature) {
        //         var {startAngle, endAngle} = getAngleStartAndEndForRange({start: 0, end: sequenceLength}, sequenceLength)
        //         console.log('startAngle, endAngle: ' + JSON.stringify([startAngle, endAngle],null,4));
        //         var path = arcUtils.drawArc(center, baseRadius + (annotationHeight + 5) * feature.yOffset + 15, annotationHeight, startAngle, endAngle )
        //         annotationsSvgs.push(<path
        //                            d={ path }
        //                            stroke="black" />)
        //     })
        //     baseRadius += rowData[0].features.length * annotationHeight
        // }

        if (selectionLayer.selected) {
            var {startAngle, endAngle} = getAngleStartAndEndForRange(selectionLayer, sequenceLength)
            var path = arcUtils.drawPiePiece(center, 50, baseRadius, startAngle, endAngle, direction)
            annotationsSvgs.push(<path
                               style={ {    opacity: .4} }
                               d={ path }
                               fill="blue" />)
        }
        var circViewStyle = assign({}, rowViewDimensions, {
            height: rowViewDimensions.height + 200
        })
        return (
            <div style={ circViewStyle }>
              <svg
                width={ baseRadius + 500 }
                height={ baseRadius + 500 }>
                <g 
                transform={ "translate(" + (baseRadius + 160) / 2 + "," + (baseRadius + 160) / 2 + ")" }
                >
                  { annotationsSvgs }
                </g>
              </svg>
            </div>
            );
    }
}

module.exports = CircularView;