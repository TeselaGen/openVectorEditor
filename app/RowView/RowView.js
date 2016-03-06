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

    _populateRows() {
        var charWidth = this.refs.fontMeasure.getBoundingClientRect().width;
        var viewWidth = this.refs.rowMeasure.sequenceContainerWidth();

        var rowLength = calculateRowLength(charWidth, viewWidth, this.props.columnWidth);

        var rowItems = [];

        for (let i = 0; i < this.props.sequenceData.size; i+=rowLength) {
            var rowData = assign({}, this.props.sequenceData);
            rowData.sequence = rowData.sequence.substr(i, rowLength);
            rowItems.push((
                <RowItem sequenceData={rowData} columnWidth={this.props.columnWidth} />
            ));
        }

        this.setState({ rowItems: rowItems });
    }

    componentDidMount() {
        new ResizeSensor(this.refs.rowView, this._populateRows.bind(this));
        this._populateRows();
    }

    render() {
        var {
            rowItems
        } = this.state;

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
