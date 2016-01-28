import React from 'react';

import { Decorator as Cerebral } from 'cerebral-view-react';

const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';

@Cerebral({
})
export default class AnnotationTable extends React.Component {

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
        
    }

    addFeature() {
        this.props.signals.addAnnotations({
            annotationType: 'features',

            annotationsToInsert: [
                { name: 'unnamed feature' }
            ],

            throwErrors: false
        });
    }

    render() {
        var {
            data,
            annotationType,
            filter
        } = this.props;

        filter = filter || Object.keys(data[0]);

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

        if (this.state.selectedRows.length === 1) {
            let displayedRow = data[this.state.selectedRows[0]];

            let rowDataItems = [];

            for (let key in displayedRow) {
                rowDataItems.push((<dt>{key}</dt>));
                rowDataItems.push((<dd>{displayedRow[key]}</dd>));
            }

            var rowDataList = React.createElement('dl', {}, rowDataItems);
        }

        if (annotationType === 'features') {
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
              <Table ref="annotationTable" multiSelectable={true} onRowSelection={this.onRowSelection.bind(this)}>
                <TableHeader>
                  <TableRow>{tableHeaderCells}</TableRow>
                </TableHeader>
                <TableBody>{tableDataRows}</TableBody>
              </Table>

              {controls}

              {rowDataList}
            </div>
        );
    }
}
