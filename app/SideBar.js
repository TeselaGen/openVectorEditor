import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

const Table = require('material-ui/Table/Table');
const TableBody = require('material-ui/Table/TableBody');
const TableHeader = require('material-ui/Table/TableHeader');
const TableHeaderColumn = require('material-ui/Table/TableHeaderColumn');
const TableRow = require('material-ui/Table/TableRow');
const TableRowColumn = require('material-ui/Table/TableRowColumn');

import AddBoxIcon from 'material-ui/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/IconButton';

import SidebarDetail from './SidebarDetail';

@Cerebral({
    minimumOrfSize: ['minimumOrfSize'],    
    readOnly: ['readOnly'],
    sidebarType: ['sidebarType']
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

    // addFeature() {
        // this needs to be changed so it just pops out the modal.
        // pop the modal open with a blank feature
        // expand later for other types of feature?
        // a button in the modal should finalize the insertion

        // var annotationForm = emptyDetails;

        // this.props.signals.addAnnotations({
        //     sidebarType: 'features',

        //     annotationsToInsert: [
        //         {
        //             name: 'unnamed feature',
        //             type: '',
        //             start: 0,
        //             end: 0,
        //             strand: -1,
        //             notes: []
        //         }
        //     ],

        //     throwErrors: true
        // });
    // }

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
        var showOrfModal = false; // may need to mvoe this to the state tree
        var tabStyle = {textAlign: 'center', flexGrow: '1', padding: '10px 30px', fontSize: '16px'};
        var selectedTabStyle = {};
        Object.assign(selectedTabStyle, tabStyle, {backgroundColor: 'white', borderTopRightRadius: '4px', borderTopLeftRadius: '4px'});
        var sidebarControlStyle = {position: 'absolute', backgroundColor: 'white', bottom: '0px', width: '100%', borderTop: '1px solid #ccc'};

        var emptyDetails = (<SidebarDetail feature={{start: 0, end: 0, strand: -1, name: "", type: ""}} />);

        var tableHeaderCells = [];
        for (let i = 0; i < filter.length; i++) {
            tableHeaderCells.push((<TableHeaderColumn key={i}>{filter[i]}</TableHeaderColumn>));
        }

        // {{}} get rid of the "data" thing
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
                // new stuff
                if (column === 'name' && sidebarType === 'Cutsites') {
                    var enz = feature['restrictionEnzyme'];
                    data = enz['name'].toString();
                }
                if (column === 'strand') {
                    if (feature['forward']) {
                        data = "+";
                    } else {
                        data = "-";
                    }
                }

                tableDataCells.push((<TableRowColumn key={j}>{data}</TableRowColumn>));
            }

            tableDataRows.push((<TableRow key={i} selected={this.state.selectedRows.indexOf(i) !== -1}>{tableDataCells}</TableRow>));
        }
        // pop out the detail modal
        // restrict to features since that's the only thing we can edit/add/remove right now
        if (this.state.selectedRows.length === 1 && sidebarType === "Features") {
            let annotation = data[this.state.selectedRows[0]];

            var annotationForm = (<SidebarDetail feature={annotation} />);
        }

        // add new feature
        var addFeature = function() {
            // deselect all rows
            var annotationForm = (<SidebarDetail feature={{start: 0, end: 0, strand: -1, name: "", type: ""}} />)
        }

        // edit, add and remove feature buttons
        var featureControls = (
            <div style={ sidebarControlStyle }>
                <IconButton onClick={addFeature()} tooltip={"add"}>
                    <AddBoxIcon />
                </IconButton>

                <IconButton onClick={this.deleteFeatures.bind(this)} disabled={this.state.selectedRows.length === 0} tooltip={"delete"}>
                    <IndeterminateCheckBoxIcon />
                </IconButton>
            </div>
        );
        var orfControls = (
            <div style={ sidebarControlStyle }>
                Minimum ORF Size: { minimumOrfSize }                
                { readOnly ? null : 
                    <div id='orfControl' onClick={function(e) {console.log("onClick", showOrfModal);}}
                    style={{display: 'inline-block', marginLeft: '10px', backgroundColor: '#65B6DE', color: 'white', padding: '3px 6px', borderRadius: '4px'}}> Change </div>                       
                }
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

        return ( // {{}} tabs onclick need to deselect any selected row
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
                    <Table ref="sideBar" style={{minWidth: '500px'}} multiSelectable={true} onRowSelection={this.onRowSelection.bind(this)}>
                        <TableHeader>
                            <TableRow>{ tableHeaderCells }</TableRow>
                        </TableHeader>
                        <TableBody deselectOnClickaway={ false }>{ tableDataRows }</TableBody>
                    </Table>
                </div>
                { (!readOnly && sidebarType ==='Features') ? featureControls : null }
                { sidebarType === 'Orfs' ? orfControls : null }

                { annotationForm }

            </div>
        );
    }
}
