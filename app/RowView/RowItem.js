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
        return elementWidth(this.refs.sequenceContainer);
    }

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
            <div className={styles.rowItem + ' ' + this.props.className}>
                <div ref={'sequenceContainer'} className={styles.sequence}>
                    {renderedSequence}
                </div>
                <div className={styles.sequence + ' ' + styles.reversed}>
                    {renderedComplement}
                </div>
            </div>
        );
    }

}
