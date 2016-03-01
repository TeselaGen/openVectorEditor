import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import styles from './RowView.scss';

export default class RowView extends React.Component {

    render() {
        return (
            <div ref={'rowView'}
                 className={styles.rowView}
            >
            </div>
        );
    }

}
