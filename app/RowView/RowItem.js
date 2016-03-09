import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString';
import { columnizeString, elementWidth } from './Utils';

import styles from './RowItem.scss';

@propTypes({
    sequenceData: PropTypes.object.isRequired,
    columnWidth: PropTypes.number
})
export default class RowItem extends React.Component {

    sequenceContainerWidth() {
        return elementWidth(this.refs.sequence);
    }

    render() {
        var {
            sequenceData,
            columnWidth
        } = this.props;

        var {
            sequence,
            offset
        } = sequenceData;

        var complement = getComplementSequenceString(sequence);

        var renderedSequence = columnizeString(sequence, columnWidth);
        var renderedComplement = columnizeString(complement, columnWidth);

        return (
            <div className={styles.rowItem + ' ' + this.props.className}>
                <div className={styles.margin}>
                    {(offset || 0) + 1}
                </div>

                <div ref={'sequenceContainer'} className={styles.sequenceContainer}>
                    <div ref={'sequence'} className={styles.sequence}>
                        {renderedSequence}
                    </div>

                    <div className={styles.sequence + ' ' + styles.reversed}>
                        {renderedComplement}
                    </div>
                </div>
            </div>
        );
    }

}
