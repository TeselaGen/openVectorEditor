import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import styles from './RowView.scss';

import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import RowItem from './RowItem.js';

@propTypes({
    sequenceData: PropTypes.object.isRequired
})
export default class RowView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        var fontSize = this.refs.fontMeasure.getBoundingClientRect().width;
        var componentWidth = this.refs.rowView.clientWidth;

        this.setState({
            rowLength: Math.floor(componentWidth / fontSize)
        });
    }

    render() {
        var {
            sequenceData
        } = this.props;

        var {
            rowLength
        } = this.state;

        var rowCount = sequenceData.size / rowLength;
        var rowItems = [];

        for (let i = 0; i < rowCount; i++) {
            rowItems.push((<RowItem sequence={sequenceData.sequence.substr(i * rowLength, rowLength)} />));
        }

        return (
            <div ref={'rowView'}
                 className={styles.rowView}
            >
                <div ref={'fontMeasure'} className={styles.fontMeasure}>m</div>
                {rowItems}
            </div>
        );
    }

}
