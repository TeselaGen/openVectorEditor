import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import styles from './RowView.scss';

import assign from 'lodash/object/assign';
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

    recalcuateRowLength() {
        var fontSize = this.refs.fontMeasure.getBoundingClientRect().width;
        var componentWidth = this.refs.rowView.clientWidth;

        var baseRowLength = Math.floor(componentWidth / fontSize);
        var adjustedRowLength = baseRowLength;

        if (this.props.columnWidth) {
            adjustedRowLength -= Math.floor(baseRowLength / this.props.columnWidth);
            adjustedRowLength = Math.floor(adjustedRowLength / this.props.columnWidth) * this.props.columnWidth;
        }

        this.setState({
            rowLength: adjustedRowLength
        });
    }

    componentDidMount() {
        this.recalcuateRowLength();
        new ResizeSensor(this.refs.rowView, this.recalcuateRowLength.bind(this));
    }

    render() {
        var {
            sequenceData,
            columnWidth
        } = this.props;

        var {
            rowLength
        } = this.state;

        var sequence = sequenceData.sequence;

        var rowCount = sequenceData.size / rowLength;
        var rowItems = [];

        for (let i = 0; i < rowCount; i++) {
            let rowSequenceData = assign({}, sequenceData);
            rowSequenceData.sequence = sequenceData.sequence.substr(i * rowLength, rowLength);

            rowItems.push((
                <RowItem
                    sequenceData={rowSequenceData}
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
