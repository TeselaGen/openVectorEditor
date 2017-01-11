import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

// {{}} remove this.state and do it correctly

import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';

import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';

import SidebarDetail from './SidebarDetail';
import SidebarEdit from './SidebarEdit';

@Cerebral({
    showAddFeatureModal: ['showAddFeatureModal'],
    showOrfModal: ['showOrfModal'],
    cutsites: ['cutsites'],
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

    onRowSelection(row) {
        var selected = this.state.selectedRows;
        var idx = selected.indexOf(row);
        if (idx === -1) {
            selected.push(row);
        } else {
            selected.splice(idx, 1);
        }
        this.setState({ selectedRows: selected });
    }

    editFeature(currentFeature) {
        this.props.signals.updateFeature({
            feature: currentFeature
        });
        this.setState({ selectedRows: [] });
    }

    deleteFeatures() {
        var featureIds = [];
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
            cutsites,
            minimumOrfSize,
            readOnly,
            sidebarType,
            signals,
            showAddFeatureModal,
            showOrfModal
        } = this.props;

        var sidebarContent;
        var controls;
        var tableHeaderCells;
        var annotationTableRows;
        var sidebarControlStyle = {position: 'absolute', backgroundColor: 'white', bottom: '0px', width: '100%', borderTop: '1px solid #ccc', marginLeft: '3px'};

        // TABS
        var tabStyle = {textAlign: 'center', flexGrow: '1', padding: '10px 30px', fontSize: '16px'};
        var selectedTabStyle = {};
        Object.assign(selectedTabStyle, tabStyle, {backgroundColor: 'white', borderTopRightRadius: '4px', borderTopLeftRadius: '4px'});

        var topTabs = (
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
        );

        // FEATURES TAB
        if (sidebarType === 'Features') {
            tableHeaderCells = [];
            tableHeaderCells.push(<th key='feathead0'>name</th>);
            tableHeaderCells.push(<th key='feathead1'>type</th>);
            tableHeaderCells.push(<th key='feathead2'>position</th>);
            tableHeaderCells.push(<th key='feathead3'>strand</th>);

            annotationTableRows = [];
            for (let i = 0; i < annotations.length; i++) {
                let annotationTableCells = [];
                let annotation = annotations[i];
                for (let j = 0; j < tableHeaderCells.length; j++) {
                    let column = tableHeaderCells[j].props.children.toString();
                    let cellEntry = '';

                    if (annotation[column] !== null && annotation[column] !== undefined) {
                        cellEntry = annotation[column].toString();
                    }
                    if (column === 'position') {
                        cellEntry = annotation['start'] + " - " + annotation['end'];
                    }
                    if (column === 'strand') {
                        if (annotation['forward']) {
                            cellEntry = "+";
                        } else {
                            cellEntry = "-";
                        }
                    }
                    annotationTableCells.push(<td key={j}>{ cellEntry }</td>);
                }

                annotationTableRows.push(<tr key={i} onClick={this.onRowSelection.bind(this, i)}>{ annotationTableCells }</tr>);
            }

            // controls
            if (!readOnly) {
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
            }
        }

        // CUTSITES TAB
        if (sidebarType === 'Cutsites') {
            tableHeaderCells = [];
            tableHeaderCells.push(<th key='cuthead0'>name</th>);
            tableHeaderCells.push(<th key='cuthead1'># cuts</th>);
            tableHeaderCells.push(<th key='cuthead2'>position</th>);
            tableHeaderCells.push(<th key='cuthead3'>strand</th>);

            annotationTableRows = [];
            for (var enzyme in annotations) { // this is an object so we loop differently
                let annotationTableCells = [];
                let annotation = annotations[enzyme];

                // first loop for enzyme name and number of cuts
                // [enzyme] [# cuts] [empty] [empty]
                for (let j = 0; j < 4; j++) {
                    let column = tableHeaderCells[j].props.children.toString();
                    let cellEntry = '';

                    if(column === 'name') {
                        cellEntry = annotation[0].restrictionEnzyme.name;
                    }
                    if (column === '# cuts') {
                        cellEntry = annotation.length;
                    }
                    annotationTableCells.push(<td key={j}>{ cellEntry }</td>);
                }
                annotationTableRows.push(<tr>{ annotationTableCells }</tr>);
                annotationTableCells = [];

                // sub loop for each cut location
                // [empty] [empty] [position] [strand]
                for (var cut in annotation) {
                    for (let k = 0; k < 4; k++) {
                        let column = tableHeaderCells[k].props.children.toString();
                        let cellEntry = '';

                        // if it's name or number of cuts it'll stay blank
                        if (column === 'position') {
                            cellEntry = annotation[cut]['start'] + " - " + annotation[cut]['end'];

                        }
                        if (column === 'strand') {
                            if (annotation[cut]['forward']) {
                                cellEntry = "+";
                            } else {
                                cellEntry = "-";
                            }
                        }
                        annotationTableCells.push(<td key={k}>{ cellEntry }</td>);
                    }
                    annotationTableRows.push(<tr>{ annotationTableCells }</tr>);
                    annotationTableCells = [];
                }
            }
        }

        // ORFS TAB
        if (sidebarType === 'Orfs') {
            tableHeaderCells = [];
            tableHeaderCells.push(<th key='orfhead0'>position</th>);
            tableHeaderCells.push(<th key='orfhead1'>length</th>);
            tableHeaderCells.push(<th key='orfhead2'>strand</th>);
            tableHeaderCells.push(<th key='orfhead3'>frame</th>);

            annotationTableRows = [];
            for (let i = 0; i < annotations.length; i++) {
                let annotationTableCells = [];
                let annotation = annotations[i];

                for (let j = 0; j < tableHeaderCells.length; j++) {
                    let column = tableHeaderCells[j].props.children;
                    let cellEntry = '';

                    if (column === 'position') {
                        cellEntry = annotation['start'] + " - " + annotation['end'];
                    }  else
                    if (column === 'strand') {
                        if (annotation['forward']) {
                            cellEntry = "+";
                        } else {
                            cellEntry = "-";
                        }
                    } else
                    if (annotation[column] !== null && annotation[column] !== undefined) {
                        cellEntry = annotation[column].toString();
                    }

                    annotationTableCells.push(<td key={j}>{ cellEntry }</td>);
                }

                annotationTableRows.push(<tr key={i}>{annotationTableCells}</tr>);
            }
            var orfControls = (
                <div style={ sidebarControlStyle }>
                    Minimum ORF Size: { minimumOrfSize }
                    { readOnly ? null :
                        <div id='orfControl' onClick={function() {signals.showChangeMinOrfSizeDialog()}}
                        style={{display: 'inline-block', marginLeft: '10px', backgroundColor: '#65B6DE', color: 'white', padding: '3px 6px', borderRadius: '4px'}}> Change </div>
                    }
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
        }

        // FEATURE DETAIL
        if (this.state.selectedRows.length === 1 && sidebarType === "Features") {
            var idx = this.state.selectedRows[0];
            var annotation = annotations[idx];

            var annotationForm = (
                <SidebarEdit
                    editFeature={this.editFeature.bind(this)}
                    feature={ annotation }
                    />
            )
            annotationTableRows[idx] = annotationForm;
        }

        var actions = (
            // {{}} why are the function calls different?
            <div>
                <FlatButton
                    label="Cancel"
                    onTouchTap={function() {signals.addFeatureModalDisplay()}}
                    />
                <FlatButton
                    label="Add Feature"
                    style={{color: "#03A9F4"}}
                    onTouchTap={this.addFeature.bind(this)}
                    />
            </div>
        );

        var sidebarDetail = (
                <SidebarDetail
                    createFeature={this.createFeature.bind(this)}
                    feature = {{start: 0, end: 0, strand: -1, name: "", type: ""}}
                    />
            );

        if (showAddFeatureModal) {
            var addFeatureDialog = (
                <Dialog
                    title="Add New Feature"
                    autoDetectWindowHeight={false}
                    autoScrollBodyContent={false}
                    open={showAddFeatureModal}
                    style={{height: '700px', position: 'absolute', maxWidth: '500px'}}
                    titleStyle={{paddingBottom: "0px"}}
                    >
                    { sidebarDetail }
                    { actions }
                </Dialog>
            );
        }

        return ( // {{}} tabs onclick need to deselect any selected row
            <div>

                { topTabs }

                <div style={{position: 'absolute', top: '42px', left: '0', right: '0', bottom: '50px', overflowY: 'scroll'}}>
                    <table ref="sideBar" style={{minWidth: '500px'}}>
                        <thead><tr>{ tableHeaderCells }</tr></thead>
                        <tbody>{ annotationTableRows }</tbody>
                    </table>
                </div>

                { featureControls }

                { orfControls }

                { addFeatureDialog }

            </div>
        );
    }
}
