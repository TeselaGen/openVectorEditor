var arcUtils = require('./graphic-helpers/arcUtils.js');
var Path = require('paths-js/path');
import assign from 'lodash/object/assign'
import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-react';
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
class RowView extends React.Component {
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
        var {
            rowViewDimensions, 
            rowData, 
            rowToJumpTo, 
            handleEditorDrag,
            handleEditorDragStart,
            handleEditorDragStop,
            handleEditorClick,
            charWidth,
            selectionLayer,
            cutsiteLabelSelectionLayer,
            annotationHeight,
            tickSpacing,
            spaceBetweenAnnotations,
            showFeatures,
            showTranslations,
            showParts,
            showOrfs,
            showAxis,
            showCutsites,
            showReverseSequence,
            caretPosition,
            sequenceLength,
            bpsPerRow,
            signals
        } = this.props;
        

        var rowViewStyle = {
            height: rowViewDimensions.height,
            width: rowViewDimensions.width,
            //   overflowY: "scroll",
            // float: "left",
            // paddingRight: "20px"
            //   padding: 10
        };
        // console.log('rowData: ' + JSON.stringify(rowData,null,4));
        var annotationHeightRunningCount = 30;
        var path = Path()
            .moveto(0, 0)
            .arc(3, 3, 2, 0, 1, 10, 10)
            .lineto(30, 50)
            .lineto(25, 28)
            .qcurveto(27, 30, 32, 27)
            .arc(3, 3, 2, 0, 1, 6, -3)
            .closepath();

        var center = {x: 250, y:250}
        var radius = 100;
        var thickness = 30;
        var startAngle = 0;
        var endAngle = 1;
        var direction = 1;
        var path2 = arcUtils.drawDirectedPiePiece(center, radius, thickness, startAngle, endAngle, direction)
        

        console.log('path.print(): ' + JSON.stringify(path.print(),null,4));
        var annotations = [];
        if (showFeatures) {
            rowData[0].features.forEach(function (feature) {
                console.log('feature.yOffset: ' + JSON.stringify(feature.yOffset,null,4));
                var path = arcUtils.drawDirectedPiePiece(center, annotationHeightRunningCount + (thickness + 5) * feature.yOffset + 15, thickness, startAngle, endAngle, direction)
                annotations.push(<path d={path} fill="blue" />)
            })
            annotationHeightRunningCount += rowData[0].features.length * thickness
        }
        if (showParts) {
            rowData[0].features.forEach(function (feature) {
                console.log('feature.yOffset: ' + JSON.stringify(feature.yOffset,null,4));
                var path = arcUtils.drawDirectedPiePiece(center, annotationHeightRunningCount + (thickness + 5) * feature.yOffset + 15, thickness, startAngle, endAngle, direction)
                annotations.push(<path d={path} fill="blue" />)
            })
            annotationHeightRunningCount += rowData[0].features.length * thickness
        }

        if (showReverseSequence) {
            rowData[0].features.forEach(function (feature) {
                console.log('feature.yOffset: ' + JSON.stringify(feature.yOffset,null,4));
                var path = arcUtils.drawDirectedPiePiece(center, annotationHeightRunningCount + (thickness + 5) * feature.yOffset + 15, thickness, startAngle, endAngle, direction)
                annotations.push(<path d={path} fill="blue" />)
            })
            annotationHeightRunningCount += rowData[0].features.length * thickness
        }
        console.log('assign: ' + JSON.stringify(assign,null,4));
        console.log('rowViewDimensions: ' + JSON.stringify(rowViewDimensions,null,4));
        var circViewStyle = assign({},rowViewDimensions, {
            // overflowX: 'none',
            // overflowY: 'none'
        })
        console.log('circViewStyle: ' + JSON.stringify(circViewStyle,null,4));
        return (
            <div style={circViewStyle}>
               <svg width={annotationHeightRunningCount + 500} height={annotationHeightRunningCount + 500}>
               <g transform={"translate("+annotationHeightRunningCount/2+","+annotationHeightRunningCount/2+")"}>
                {annotations}
               </g>
               <path d={path.print()} fill="blue" />
                
               </svg>
            </div>
        );
    }
}

module.exports = RowView;