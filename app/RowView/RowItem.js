import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import styles from './RowItem.scss';

@propTypes({
    sequence: PropTypes.string.isRequired,
    columnWidth: PropTypes.number
})
export default class RowItem extends React.Component {

    render() {
        var {
            sequence,
            complement,
            columnWidth
        } = this.props;

        var renderedSequence = sequence;
        var renderedComplement = complement;

        if (columnWidth) {
            let rColumnChunks = [];
            let cColumnChunks = [];
            for (let i = 0; i < sequence.length; i += columnWidth) {
                rColumnChunks.push(
                    sequence.substr(i, columnWidth)
                );

                cColumnChunks.push(
                    complement.substr(i, columnWidth)
                );
            }

            renderedSequence = rColumnChunks.join(' ');
            renderedComplement = cColumnChunks.join(' ');
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
