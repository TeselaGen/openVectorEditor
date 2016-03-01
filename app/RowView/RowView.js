import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import styles from './RowView.scss';

import ResizeSensor from 'css-element-queries/src/ResizeSensor';

@propTypes({
    sequenceData: PropTypes.object.isRequired
})
export default class RowView extends React.Component {

    render() {
        var {
            sequenceData
        } = this.props;

        return (
            <div ref={'rowView'}
                 className={styles.rowView}
            >
            </div>
        );
    }

}
