import React, { PropTypes } from 'react';

import { Decorator as Cerebral } from 'cerebral-view-react';
import { propTypes } from './react-props-decorators.js';

const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';

import FeatureForm from './FeatureForm';

@Cerebral({
})
@propTypes({
    data: PropTypes.array.isRequired,
    annotationType: PropTypes.string.isRequired,
    filter: PropTypes.array.isRequired
})
export default class SideBar extends React.Component {

    constructor() {
        super(arguments);

        this.state = {
            selectedRows: []
        };
    }

    onRowSelection(selectedRows) {
        this.setState({ selectedRows: selectedRows });
    }

    deleteFeatures() {
        var featureIds = [];

        this.state.selectedRows.forEach(el => {
            featureIds.push(this.props.data[el].id);
        });

        this.props.signals.deleteFeatures({ featureIds: featureIds });
        this.setState({ selectedRows: [] });
    }

    addFeature() {
        this.props.signals.addAnnotations({
            annotationType: 'Features',

            annotationsToInsert: [
                {
                    name: 'unnamed feature',
                    type: '',
                    start: 0,
                    end: 0,
                    strand: -1,
                    notes: []
                }
            ],

            throwErrors: false
        });
    }

    render() {
        var {
            data,
            annotationType,
            filter,
            signals
        } = this.props;

        var tableHeaderCells = [];
        for (let i = 0; i < filter.length; i++) {
            tableHeaderCells.push((<TableHeaderColumn key={i}>{filter[i]}</TableHeaderColumn>));
        }

        var tableDataRows = [];
        for (let i = 0; i < data.length; i++) {
            let tableDataCells = [];
            let feature = data[i];

            for (let j = 0; j < filter.length; j++) {
                let column = filter[j];
                let data = '';

                if (feature[column] !== null && feature[column] !== undefined) {
                    data = feature[column].toString();
                }

                tableDataCells.push((<TableRowColumn key={j}>{data}</TableRowColumn>));
            }

            tableDataRows.push((<TableRow key={i} selected={this.state.selectedRows.indexOf(i) !== -1}>{tableDataCells}</TableRow>));
        }

        var featureTabs;
        var tabStyle = {textAlign: 'center', flexGrow: '1', padding: '10px 30px', backgroundColor: '#ccc', fontSize: '16px'};

        if (this.state.selectedRows.length === 1) {
            let annotation = data[this.state.selectedRows[0]];

            var annotationForm = (<FeatureForm feature={annotation} />);
        }

        if (annotationType === 'Features') {
            var controls = (
                <div>
                    <IconButton onClick={this.addFeature.bind(this)} tooltip={"add"}>
                        <AddBoxIcon />
                    </IconButton>

                    <IconButton onClick={this.deleteFeatures.bind(this)} disabled={this.state.selectedRows.length === 0}tooltip={"delete"}>
                        <IndeterminateCheckBoxIcon />
                    </IconButton>
                </div>
            );
        }

        return (
            <div>
                <div id='featureTabs' style={{display: 'flex'}}>
                    <div style={tabStyle} onTouchTap={function() {
                        signals.sidebarDisplay({ type: 'Features' });
                    }}>Features</div>
                    <div style={tabStyle} onTouchTap={function () {
                        signals.sidebarDisplay({ type: 'Cutsites' });
                    }}>Cutsites</div>
                    <div style={tabStyle} onTouchTap={function () {
                        signals.sidebarDisplay({ type: 'Orfs' });
                    }}>ORFs</div>
                </div>
                <table ref="sideBar" style={{borderRight: '1px solid #ccc', minWidth: '500px'}} multiSelectable={true} onRowSelection={this.onRowSelection.bind(this)}>
                    <th>
                        <tr>{tableHeaderCells}</tr>
                    </th>
                    <tbody deselectOnClickaway={false}>{tableDataRows}</tbody>
                </table>

                {controls}

                {annotationForm}
            </div>
        );
    }
}
