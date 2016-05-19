import React  from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString';
import { columnizeString, elementWidth, calculateRowLength, layerInBounds } from './Utils';

import styles from './Row.scss';

export default class Row extends React.Component {

    getMaxSequenceLength(charWidth, columnWidth) {
        var sequenceWidthPx = elementWidth(this.refs.sequenceContainer);
        return calculateRowLength(charWidth, sequenceWidthPx, columnWidth);
    }

    _resizeSVG() {
        var {
            sequenceContainer,
            annotationContainer
        } = this.refs;

        for (let svg of [sequenceContainer, annotationContainer]) {
            var bbox = svg.getBBox();
            svg.setAttribute('height', bbox.y + bbox.height + 'px');
        }
    }

    componentDidMount() {
        this._resizeSVG();
    }

    componentDidUpdate() {
        this._resizeSVG();
    }

    _sliceLayer(layer) {
        var {
            sequenceData: {sequence, offset, charWidth},
            columnWidth
        } = this.props;

        var sequenceLength = sequence.length;

        var slicedLayer = {};

        if (layer) {
            // slice the layer
            slicedLayer.start = layer.start - offset;
            slicedLayer.width = layer.end - layer.start;

            // crop the layer
            slicedLayer.width = (slicedLayer.start + slicedLayer.width > sequenceLength) ? sequenceLength - slicedLayer.start : slicedLayer.width;

            // insert gutters
            let preGutters = slicedLayer.start / columnWidth;
            let midGutters = (slicedLayer.start + slicedLayer.width) / columnWidth - preGutters;

            slicedLayer.start += preGutters;
            slicedLayer.width += midGutters;

            // multiply by characters
            slicedLayer.start *= charWidth;
            slicedLayer.width *= charWidth;
        }

        return slicedLayer;
    }

    _processProps(props) {
        var {
            sequenceData,
            columnWidth,
            selectionLayer
        } = props;

        var {
            sequence,
            offset,
            className,
            charWidth
        } = sequenceData;

        var complement = getComplementSequenceString(sequence);

        var renderedSequence = columnizeString(sequence, columnWidth);
        var renderedComplement = columnizeString(complement, columnWidth);

        var renderedSelectionLayer = this._sliceLayer(selectionLayer);

        return {
            renderedSequence: renderedSequence,
            renderedComplement: renderedComplement,
            renderedOffset: (offset || 0) + 1,
            renderedSelectionLayer: renderedSelectionLayer
        };
    }

    render() {
        var {
            className,
            sequenceData: { features, offset, charWidth },
            columnWidth,
            onAnnotationClick
        } = this.props;

        var {
            renderedSequence,
            renderedComplement,
            renderedOffset,
            renderedSelectionLayer
        } = this._processProps(this.props);

        var featureIndex = 0;

        return (
            <div className={styles.rowItem + ' ' + className}>
                <div className={styles.margin}>
                    {renderedOffset}
                </div>

                <div className={styles.containers}>
                    <svg data-offset={offset} ref={'sequenceContainer'} className={styles.sequenceContainer}>
                        <text ref={'sequence'} className={styles.sequence}>
                            <tspan className={styles.sequence}>
                                {renderedSequence}
                            </tspan>

                            <tspan x={0} dy={'1.2em'} className={styles.sequence + ' ' + styles.reversed}>
                                {renderedComplement}
                            </tspan>
                        </text>

                        {layerInBounds(renderedSelectionLayer, {start: 0, end: renderedSequence.length * charWidth}) &&
                         <svg viewBox={'0 0 1 1'} preserveAspectRatio={'none'} x={renderedSelectionLayer.start} y={0} width={renderedSelectionLayer.width} height={'100%'}>
                             <polygon points={'0 0, 0 1, 1 1, 1 0'} style={{fill: 'blue', opacity: 0.4}} />
                         </svg>
                        }
                    </svg>

                    <svg ref={'annotationContainer'} className={styles.annotationContainer}>
                        {features && features.map((feature) => {
                             var slicedFeature = this._sliceLayer(feature);
                             var render = null;

                             if (layerInBounds(slicedFeature, {start: 0, end: renderedSequence.length * charWidth})) {
                                 render = (
                                     <svg viewBox={'0 0 1 1'} preserveAspectRatio={'none'} x={slicedFeature.start} y={(featureIndex * 1.2) + 'em'} width={slicedFeature.width} height={'1em'}>
                                         <polygon onClick={function() { onAnnotationClick(feature) }} points={'0 0, 0 1, 1 1, 1 0'} fill={feature.color} opacity={'0.4'} strokeWidth={1} stroke={feature.color} />
                                     </svg>
                                 );

                                 featureIndex++;
                             }

                             return render;
                         })}
                    </svg>
                </div>
            </div>
        );
    }

}
