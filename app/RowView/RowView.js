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

        this.state = {
            rowData: []
        };
    }

    _populateRows() {
        var {
            sequenceData,
            columnWidth
        } = this.props;

        var {
            fontMeasure,
            rowMeasure
        } = this.refs;

        var charWidth = fontMeasure.getBoundingClientRect().width;
        var viewWidth = rowMeasure.sequenceContainerWidth();

        var rowLength = calculateRowLength(charWidth, viewWidth, columnWidth);

        var rowData = [];

        for (let i = 0; i < sequenceData.size; i += rowLength) {
            let data = {};
            data.sequence = sequenceData.sequence.substr(i, rowLength);
            data = assign({}, sequenceData, data);
            rowData.push(data);
        }

        this.setState({ rowData: rowData });
    }

    componentDidMount() {
        new ResizeSensor(this.refs.rowView, this._populateRows.bind(this));
        this._populateRows();
    }

    render() {
        var {
            columnWidth
        } = this.props;

        var {
            rowData
        } = this.state;

        return (
            <div ref={'rowView'}
                 className={styles.rowView}
            >
                <div ref={'fontMeasure'} className={styles.fontMeasure}>m</div>
                <RowItem ref={'rowMeasure'} sequenceData={{ sequence: '' }} className={styles.rowMeasure} />
                {
                    rowData.map(datum => <RowItem sequenceData={datum} columnWidth={columnWidth} />)
                }
            </div>
        );
    }

}
