import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString';

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

        var renderedSequence = sequence;

        var complement = getComplementSequenceString(sequence);
        var renderedComplement = complement;

        if (columnWidth) {
            renderedSequence = '';
            renderedComplement = '';

            for (let i = 0; i < sequence.length; i += columnWidth) {
                renderedSequence += sequence.substr(i, columnWidth) + ' ';

                renderedComplement += complement.substr(i, columnWidth) + ' ';
            }
        }

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
