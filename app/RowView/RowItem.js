import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString';
import { columnizeString } from './Utils';

import styles from './RowItem.scss';

@propTypes({
    sequenceData: PropTypes.object.isRequired,
    columnWidth: PropTypes.number
})
export default class RowItem extends React.Component {

    render() {
        var {
            sequenceData,
            columnWidth
        } = this.props;

        var {
            sequence
        } = sequenceData;

        var complement = getComplementSequenceString(sequence);

        var renderedSequence = columnizeString(sequence, columnWidth);
        var renderedComplement = columnizeString(complement, columnWidth);

        return (
            <div className={styles.rowItem}>
                <div className={styles.sequence}>
                    {renderedSequence}
                </div>
                <div className={styles.reversedSequence}>
                    {renderedComplement}
                </div>
            </div>
        );
    }

}
