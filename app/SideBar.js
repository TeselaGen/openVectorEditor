import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

// {{}} remove this.state and do it correctly

const Dialog = require('material-ui/lib/dialog');
const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';

import SidebarDetail from './SidebarDetail';

@Cerebral({
    showAddFeatureModal: ['showAddFeatureModal'],
    showOrfModal: ['showOrfModal'],
    cutsitesByName: ['cutsitesByName'],
    minimumOrfSize: ['minimumOrfSize'],    
    readOnly: ['readOnly'],
    sidebarType: ['sidebarType']
})

export default class SideBar extends React.Component {
    constructor() {
        super(arguments);

        this.state = {
            selectedRows: [],
            newFeature: {},
        };
    }

    onRowSelection(selectedRows) {
        this.setState({ selectedRows: selectedRows });
    }

    editFeature(currentFeature) {
        this.props.signals.updateFeature({
            feature: currentFeature
        });
        this.setState({ selectedRows: [] });
    }

    deleteFeatures() {
        var featureIds = [];
        console.log(this.props.annotations);
        this.state.selectedRows.forEach(el => {
            featureIds.push(this.props.annotations[el].id);
        });

        this.props.signals.deleteFeatures({ featureIds: featureIds });
        this.setState({ selectedRows: [] });
    }

    openAddFeatureDisplay() {
        this.setState({ selectedRows: [] });
        this.props.signals.addFeatureModalDisplay();
    }

    createFeature(newFeature) {
        this.setState({
            newFeature: newFeature,
        });
    }

    addFeature() {
        this.props.signals.addAnnotations({
            sidebarType: 'features',

            annotationsToInsert: [
                this.state.newFeature
            ],

            throwErrors: true
        });
        this.props.signals.addFeatureModalDisplay();
    }

    render() {
        var {
            annotations,
            headers,            
            minimumOrfSize,
            readOnly,
            sidebarType,
            signals,
            showAddFeatureModal,
            showOrfModal
        } = this.props;

        var featureTabs;
        var controls;
        var tabStyle = {textAlign: 'center', flexGrow: '1', padding: '10px 30px', fontSize: '16px'};
        var selectedTabStyle = {};
        Object.assign(selectedTabStyle, tabStyle, {backgroundColor: 'white', borderTopRightRadius: '4px', borderTopLeftRadius: '4px'});
        var sidebarControlStyle = {position: 'absolute', backgroundColor: 'white', bottom: '0px', width: '100%', borderTop: '1px solid #ccc', marginLeft: '3px'};

        // fill out the tables
        var tableHeaderCells = [];
        for (let i = 0; i < headers.length; i++) {
            tableHeaderCells.push((<TableHeaderColumn key={i}>{headers[i]}</TableHeaderColumn>));
        }

        var annotationTableRows = [];
        for (let i = 0; i < annotations.length; i++) {
            let annotationTableCells = [];
            let annotation = annotations[i];

            for (let j = 0; j < headers.length; j++) {
                let column = headers[j];
                let annotations = '';

                // handle cutsites. maybe need to revamp this whole thing
                if(sidebarType === 'Cutsites') {

                }
                if (annotation[column] !== null && annotation[column] !== undefined) {
                    annotations = annotation[column].toString();
                }
                if (column === 'strand') {
                    if (annotation['forward']) {
                        annotations = "+";
                    } else {
                        annotations = "-";
                    }
                }

                annotationTableCells.push((<TableRowColumn key={j}>{ annotations }</TableRowColumn>));
            }

            annotationTableRows.push((<TableRow key={i} selected={this.state.selectedRows.indexOf(i) !== -1}>{annotationTableCells}</TableRow>));
        }
        // pop out the detail modal
        // restrict to features since that's the only thing we can edit/add/remove right now
        if (this.state.selectedRows.length === 1 && sidebarType === "Features") {
            let annotation = annotations[this.state.selectedRows[0]];

            var annotationForm = (<SidebarDetail editFeature={this.editFeature.bind(this)} feature={ annotation } />);

        }

        var actions = [
            <FlatButton
                label="Cancel"
                onTouchTap={function() {signals.addFeatureModalDisplay()}}
            />,
            <FlatButton
                label="Add Feature"
                style={{color: "#03A9F4"}}
                onTouchTap={this.addFeature.bind(this)}
            />,
        ];

        var sidebarDetail = (<SidebarDetail createFeature={this.createFeature.bind(this)} feature = {{start: 0, end: 0, strand: -1, name: "", type: ""}}/>);

        if (showAddFeatureModal) {
            var addFeatureDialog = (
                <Dialog
                    title="Add New Feature"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={actions}
                    open={showAddFeatureModal}
                    style={{height: '700px', position: 'absolute', maxWidth: '500px'}}
                    titleStyle={{paddingBottom: "0px"}}
                >
                    {sidebarDetail}
                </Dialog>
            );
        }

        // add and remove feature buttons
        var featureControls = (
            <div style={ sidebarControlStyle }>
                <IconButton
                    onTouchTap={this.openAddFeatureDisplay.bind(this)}
                    tooltip="add"
                >
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
                    <div id='orfControl' onClick={function() {signals.showChangeMinOrfSizeDialog()}}
                    style={{display: 'inline-block', marginLeft: '10px', backgroundColor: '#65B6DE', color: 'white', padding: '3px 6px', borderRadius: '4px'}}> Change </div>
                }
                <span>          </span>
                { showOrfModal ? 
                    <div id='orfModal' style={{display: 'inline', marginLeft:'20px', height: '26px'}}>
                        <input id='orfInput' type='number' defaultValue={ minimumOrfSize }/>
                        <button name='setOrfMin' onTouchTap={function () {
                            var newMinVal = document.getElementById('orfInput').value;
                            signals.changeOrfMin({ newMin: newMinVal });
                            signals.showChangeMinOrfSizeDialog();
                        }}>Set</button>
                        <button name='closeOrfModal' onClick={function() {signals.showChangeMinOrfSizeDialog()}}>Cancel</button>
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
                        <TableHeader displaySelectAll={ false } adjustForCheckbox={ false }>
                            <TableRow>{ tableHeaderCells }</TableRow>
                        </TableHeader>
                        <TableBody deselectOnClickaway={ false } displayRowCheckbox={ false }>{ annotationTableRows }</TableBody>
                    </Table>
                </div>
                { (!readOnly && sidebarType ==='Features') ? featureControls : null }
                { sidebarType === 'Orfs' ? orfControls : null }

                { annotationForm }
                {addFeatureDialog}

            </div>
        );
    }
}
