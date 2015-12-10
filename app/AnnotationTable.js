import React from 'react';

const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

export default class AnnotationTable extends React.Component {
    render() {
        var {
            data,
            filter
        } = this.props;

        filter = filter || Object.keys(data[0]);

        var tableHeaderCells = [];
        for (let i = 0; i < filter.length; i++) {
            tableHeaderCells.push((<TableHeaderColumn>{filter[i]}</TableHeaderColumn>));
        }

        var tableDataRows = [];
        for (let i = 0; i < data.length; i++) {
            let tableDataCells = [];
            let feature = data[i];

            for (let j = 0; j < filter.length; j++) {
                let column = filter[j];
                let data = feature[column];

                // FIXME: objects in the data breaks things
                if (typeof data === 'object') {
                    continue;
                }

                tableDataCells.push((<TableRowColumn>{data}</TableRowColumn>));
            }

            tableDataRows.push((<TableRow>{tableDataCells}</TableRow>));
        }

        return (
            <Table ref="annotationTable">
              <TableHeader>
                <TableRow>{tableHeaderCells}</TableRow>
              </TableHeader>
              <TableBody>{tableDataRows}</TableBody>
            </Table>
        );
    }
}
