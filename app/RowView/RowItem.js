import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import styles from './RowItem.scss';

@propTypes({
    sequence: PropTypes.string.isRequired
})
export default class RowItem extends React.Component {

    render() {
        var {
            sequence
        } = this.props;

        return (
            <div className={styles.rowItem}>
                {sequence}
            </div>
        );
    }

}
