import React from 'react';

export default class AnnotationTable extends React.Component {
    render() {
        var {
            data,
            filter
        } = this.props;

        filter = filter || Object.keys(data[0]);

        var tableHeaderCells = [];
        for (let i = 0; i < filter.length; i++) {
            tableHeaderCells.push((<td>{filter[i]}</td>));
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

                tableDataCells.push((<td>{data}</td>));
            }

            tableDataRows.push((<tr>{tableDataCells}</tr>));
        }

        return (
            <table ref="annotationTable">
              <thead>
                <tr>{tableHeaderCells}</tr>
              </thead>
              <tbody>{tableDataRows}</tbody>
            </table>
        );
    }
}
