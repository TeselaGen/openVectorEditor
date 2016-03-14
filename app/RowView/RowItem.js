import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString';
import { columnizeString, elementWidth, calculateRowLength } from './Utils';

import styles from './RowItem.scss';

@propTypes({
    sequenceData: PropTypes.object.isRequired,
    columnWidth: PropTypes.number
})
export default class RowItem extends React.Component {

    getMaxSequenceLength(charWidth, columnWidth) {
        var sequenceWidthPx = elementWidth(this.refs.sequenceContainer);
        return calculateRowLength(charWidth, sequenceWidthPx, columnWidth);
    }

    _resizeSVG() {
        var {
            sequenceContainer: svg
        } = this.refs;

        var bbox = svg.getBBox();
        svg.setAttribute('height', bbox.y + bbox.height + 'px');
    }

    componentDidMount() {
        this._resizeSVG();
    }

    componentDidUpdate() {
        this._resizeSVG();
    }

    render() {
        var {
            sequenceData,
            columnWidth
        } = this.props;

        var {
            sequence,
            offset,
            className
        } = sequenceData;

        var complement = getComplementSequenceString(sequence);

        var renderedSequence = columnizeString(sequence, columnWidth);
        var renderedComplement = columnizeString(complement, columnWidth);

        return (
            <div className={styles.rowItem + ' ' + className}>
                <div className={styles.margin}>
                    {(offset || 0) + 1}
                </div>

                <svg ref={'sequenceContainer'} className={styles.sequenceContainer}>
                    <text ref={'sequence'} className={styles.sequence}>
                        <tspan className={styles.sequence}>
                            {renderedSequence}
                        </tspan>

                        <tspan x={0} dy={'1.2em'} className={styles.sequence + ' ' + styles.reversed}>
                            {renderedComplement}
                        </tspan>
                    </text>
                </svg>
            </div>
        );
    }

}
