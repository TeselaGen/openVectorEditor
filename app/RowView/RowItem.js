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
            columnWidth
        } = this.props;

        var renderedSequence = sequence;

        if (columnWidth) {
            let columnChunks = [];
            for (let i = 0; i < sequence.length; i += columnWidth) {
                columnChunks.push(
                    sequence.substr(i, columnWidth)
                );
            }

            renderedSequence = columnChunks.join(' ');
        }

        return (
            <div className={styles.rowItem}>
                {renderedSequence}
            </div>
        );
    }

}
