import some from 'lodash/collection/some'
import React from 'react';
import Draggable from 'react-draggable'
import styles from './RowView.scss';
import { Decorator as Cerebral } from 'cerebral-view-react';
import ReactList from 'react-list';
import RowItem from './RowItem/RowItem.js'
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import prepareRowData from 've-sequence-utils/prepareRowData';
import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';

var defaultContainerWidth = 400
var defaultCharWidth = 12
var defaultMarginWidth = 10

function noop() {
}

@Cerebral({
    annotationHeight: ['annotationHeight'],
    bpsPerRow: ['bpsPerRow'],
    caretPosition: ['caretPosition'],     
    charWidth: ['charWidth'], 
    circularAndLinearTickSpacing: ['circularAndLinearTickSpacing'],    
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],         
    cutsites: ['cutsites'],
    orfs: ['orfData'],
    rowData: ['rowData'],
    rowViewDimensions: ['rowViewDimensions'],
    selectionLayer: ['selectionLayer'],
    sequenceData: ['sequenceData'],
    sequenceLength: ['sequenceLength'],
    sequenceName: ['sequenceData', 'name'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showCaret: ['showCaret'],
    showSequence: ['showSequence'],
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations']     
})

export default class RowView extends React.Component {

    getNearestCursorPositionToMouseEvent(event, sequenceLength, callback) {
        if (!event.clientX) {
            return;
        }
        var boundingRect = this.refs.rowView.getBoundingClientRect()
        //get relative click positions
        var clickX = (event.clientX - boundingRect.left - boundingRect.width/2)
        var clickY = (event.clientY - boundingRect.top - boundingRect.height/2)

        console.log(clickX)
        console.log(clickY)
        console.log("---")

        var nearestBP = normalizePositionByRangeLength(clickX, sequenceLength, true) //true because we're in between positions
        var caretGrabbed = event.target.className && event.target.className.animVal === "cursor"
        callback({
            shiftHeld: event.shiftKey,
            nearestBP,
            caretGrabbed
        });
    }

    render() {
        var {
            sequenceData,
            sequenceLength,
            selectionLayer,
            sequenceName,
            cutsites,
            orfs,
            showAxis,
            showCaret,
            showCutsites,
            showFeatures,
            showOrfs,
            annotationHeight,
            spaceBetweenAnnotations,
            annotationVisibility,
            caretPosition,
            rowViewDimensions,
            marginWidth=defaultMarginWidth,
            signals,
            bpsPerRow,
            rowData
        } = this.props;

        var renderItem = (index,key) =>{
            if (rowData[index]) {
                return (
                    <div data-row-number={index} key={key}>
                        <div className={'veRowItemSpacer'} />
                        <RowItem row={rowData[index]} />
                    </div>
                );
            } else {
                return null
            }
        }

        return (
            <Draggable
                bounds={{top: 0, left: 0, right: 0, bottom: 0}}
                onDrag={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, sequenceLength, signals.editorDragged)}
                }
                onStart={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, sequenceLength, signals.editorDragStarted)}
                }
                onStop={signals.editorDragStopped}
                >
                <div
                    onClick={(event) => {
                        this.getNearestCursorPositionToMouseEvent(event, sequenceLength, signals.editorClicked);
                    }}
                    ref="rowView"
                    className={styles.RowView + " veRowView"}
                    >
                    <div ref={'fontMeasure'} className={styles.fontMeasure}>m</div>
                    <ReactList
                        ref={c => {
                            this.InfiniteScroller= c
                        }}
                        itemRenderer={renderItem}
                        length={rowData.length}
                        itemSizeEstimator={itemSizeEstimator}
                        type='simple'
                        />
                </div>
            </Draggable>
        );
    }
}

function itemSizeEstimator(index, cache) {
    if (cache[index+1]) {
        return cache[index+1]
    }
    if (cache[index-1]) {
        return cache[index-1]
    }
    return 100
}