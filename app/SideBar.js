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
    minimumOrfSize: ['minimumOrfSize'],    
    readOnly: ['readOnly'],
    sidebarType: ['sidebarType']
})
@propTypes({
    data: PropTypes.array.isRequired,
    sidebarType: PropTypes.string.isRequired,
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
            sidebarType: 'Features',

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
            filter,            
            minimumOrfSize,
            readOnly,
            sidebarType,
            signals
        } = this.props;

        var featureTabs;
        var controls;
        var showOrfModal;
        var tabStyle = {textAlign: 'center', flexGrow: '1', padding: '10px 30px', fontSize: '16px'};
        var selectedTabStyle = {};
        Object.assign(selectedTabStyle, tabStyle, {backgroundColor: 'white', borderTopRightRadius: '4px', borderTopLeftRadius: '4px'});
        var sidebarControlStyle = {position: 'absolute', backgroundColor: 'white', bottom: '0px', width: '100%', borderTop: '1px solid #ccc'};

        var tableHeaderCells = [];
        for (let i = 0; i < filter.length; i++) {
            tableHeaderCells.push((<td key={i}>{filter[i]}</td>));
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

                tableDataCells.push((<td key={j}>{data}</td>));
            }

            tableDataRows.push((<tr key={i} selected={this.state.selectedRows.indexOf(i) !== -1}>{tableDataCells}</tr>));
        }

        if (this.state.selectedRows.length === 1) {
            let annotation = data[this.state.selectedRows[0]];

            var annotationForm = (<FeatureForm feature={annotation} />);
        }

        // edit, add and remove feature buttons
        var featureControls = (
            <div style={ sidebarControlStyle }>
                <IconButton onClick={this.addFeature.bind(this)} tooltip={"add"}>
                    <AddBoxIcon />
                </IconButton>

                <IconButton onClick={this.deleteFeatures.bind(this)} disabled={this.state.selectedRows.length === 0}tooltip={"delete"}>
                    <IndeterminateCheckBoxIcon />
                </IconButton>
            </div>
        );
        var orfControls = (
            <div style={ sidebarControlStyle }>
                Minimum ORF Size: { minimumOrfSize }                
                {/* readOnly ? null : 
                    <div id='orfControl' onClick={function() {showOrfModal = true;}}
                    style={{display: 'inline-block', marginLeft: '10px', backgroundColor: '#65B6DE', color: 'white', padding: '3px 6px', borderRadius: '4px'}}> Change </div>                       
                */}
                { showOrfModal ? 
                    <div id='orfModal' style={{position: 'fixed', top: '250px', left: '250px', height: '70px'}}>
                        <input id='orfInput' type='number' defaultValue={ minimumOrfSize }/>
                        <button name='setOrfMin' onTouchTap={function () {
                            var newMinVal = document.getElementById('orfInput').value;
                            signals.changeOrfMin({ newMin: newMinVal });
                            showOrfModal = false;
                        }}>Set</button>
                        <button name='closeOrfModal' onClick={ function() {showOrfModal = false
                        }}>Cancel</button>
                    </div> : null 
                }
            </div>
        );

        return (
            <div>
                <div id='featureTabs' style={{display: 'flex', backgroundColor: '#ccc'}}>
                    <div style={sidebarType==='Features' ? selectedTabStyle : tabStyle} onClick={function() {
                        signals.sidebarDisplay({ type: 'Features' });
                    }}>Features</div>
                    <div style={sidebarType==='Cutsites' ? selectedTabStyle : tabStyle}  onClick={function () {
                        signals.sidebarDisplay({ type: 'Cutsites' });
                    }}>Cutsites</div>
                    <div style={sidebarType==='Orfs' ? selectedTabStyle : tabStyle}  onClick={function () {
                        signals.sidebarDisplay({ type: 'Orfs' });
                    }}>ORFs</div>
                </div>
                <div style={{position: 'absolute', top: '42px', left: '0', right: '0', bottom: '50px', overflowY: 'scroll'}}>
                    <table ref="sideBar" style={{minWidth: '500px'}} multiSelectable={true} onRowSelection={this.onRowSelection.bind(this)}>
                        <thead>
                            <tr>{tableHeaderCells}</tr>
                        </thead>
                        <tbody deselectOnClickaway={false}>{tableDataRows}</tbody>
                    </table>
                </div>
                {(!readOnly && sidebarType ==='Features') ? featureControls : null}
                {sidebarType === 'Orfs' ? orfControls : null}

                {annotationForm}

            </div>
        );
    }
}
