import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import styles from './RowView.scss';

import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import RowItem from './RowItem.js';

@propTypes({
    sequenceData: PropTypes.object.isRequired,
    columnWidth: PropTypes.number
})
export default class RowView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        var fontSize = this.refs.fontMeasure.getBoundingClientRect().width;
        var componentWidth = this.refs.rowView.clientWidth;

        var baseRowLength = Math.floor(componentWidth / fontSize);
        var adjustedRowLength = baseRowLength;

        if (this.props.columnWidth) {
            adjustedRowLength -= Math.floor(baseRowLength / this.props.columnWidth);
        }

        this.setState({
            rowLength: adjustedRowLength
        });
    }

    render() {
        var {
            sequenceData,
            columnWidth
        } = this.props;

        var {
            rowLength
        } = this.state;

        var rowCount = sequenceData.size / rowLength;
        var rowItems = [];

        for (let i = 0; i < rowCount; i++) {
            rowItems.push((
                <RowItem
                    sequence={sequenceData.sequence.substr(i * rowLength, rowLength)}
                    columnWidth={columnWidth}
                />
            ));
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
