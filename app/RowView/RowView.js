import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import styles from './RowView.scss';

import assign from 'lodash/object/assign';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import { calculateRowLength } from './Utils';

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
        var setRowLength = () => {
            var charWidth = this.refs.fontMeasure.getBoundingClientRect().width;
            var viewWidth = this.refs.rowMeasure.sequenceContainerWidth();

            this.setState({
                rowLength: calculateRowLength(charWidth, viewWidth, this.props.columnWidth)
            });
        }

        new ResizeSensor(this.refs.rowView, setRowLength);
        setRowLength();
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
                <RowItem ref={'rowMeasure'} sequenceData={{ sequence: '' }} className={styles.rowMeasure} />
                {rowItems}
            </div>
        );
    }

}
