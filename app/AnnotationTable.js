import React from 'react';

const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

export default class AnnotationTable extends React.Component {

    constructor() {
        super(arguments);

        this.state = {};
    }

    selectRow(selectedRows) {
        this.setState({ selectedRow: selectedRows[0] });
    }

    render() {
        var {
            data,
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

            tableDataRows.push((<TableRow key={i}>{tableDataCells}</TableRow>));
        }

        if (this.state.selectedRow !== undefined) {
            let displayedRow = data[this.state.selectedRow];

            let rowDataItems = [];

            for (let key in displayedRow) {
                rowDataItems.push((<dt>{key}</dt>));
                rowDataItems.push((<dd>{displayedRow[key]}</dd>));
            }

            var rowDataList = React.createElement('dl', {}, rowDataItems);
        }

        return (
            <div>
              <Table ref="annotationTable" onRowSelection={this.selectRow.bind(this)}>
                <TableHeader>
                  <TableRow>{tableHeaderCells}</TableRow>
                </TableHeader>
                <TableBody>{tableDataRows}</TableBody>
              </Table>

              {rowDataList}
            </div>
        );
    }
}
