import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

// {{}} remove this.state and do it correctly

import Dialog from 'material-ui/lib/dialog';
import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import CheckCircle from 'material-ui/lib/svg-icons/check-circle';
import CancelIcon from 'material-ui/lib/svg-icons/cancel-icon';
import EditIcon from 'material-ui/lib/svg-icons/edit-icon';
import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';

import SidebarDetail from './SidebarDetail';
import SidebarEdit from './SidebarEdit';
import styles from './side-bar.css'

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
            selectedFeatures: [],
            selectedOrfs: [],
            newFeature: {},
            editfeature: -1
        };
    }

    onFeatureSelection(row) {
        if (this.state.editFeature > -1) {
            this.setState({ editFeature: -1 });
        }
        let selected = this.state.selectedFeatures;
        let idx = selected.indexOf(row);
        if (idx === -1) {
            selected.push(row);
        } else {
            selected.splice(idx, 1);
        }
        this.setState({ selectedFeatures: selected });
    }

    onOrfSelection(row) {
        let selected = this.state.selectedOrfs;
        let idx = selected.indexOf(row);
        if (idx === -1) {
            selected.push(row);
        } else {
            selected.splice(idx, 1);
        }
        this.setState({ selectedOrfs: selected });
    }

    onEditIconClick(row) {
        this.setState({ editFeature: row });
        this.setState({ selectedFeatures: [row] })
    }

    editFeature(currentFeature) {
        this.props.signals.updateFeature({
            feature: currentFeature
        });
        this.setState({ editFeature: -1 });
    }

    deleteFeatures() {
        var featureIds = [];
        this.state.selectedFeatures.forEach(el => {
            featureIds.push(this.props.annotations[el].id);
        });

        this.props.signals.deleteFeatures({ featureIds: featureIds });
        // this.setState({ selectedFeatures: [] });
    }

    openAddFeatureDisplay() {
        // this.setState({ selectedFeatures: [] });
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

    highlightOrf(row) {
        return this.state.selectedOrfs.indexOf(row) === -1 ? 'white' : '#E1E1E1';
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
            tableHeaderCells.push(<th key='feathead0' style={{width: '30%'}}>name</th>);
            tableHeaderCells.push(<th key='feathead1' style={{width: '30%'}}>type</th>);
            tableHeaderCells.push(<th key='feathead2'>position</th>);
            tableHeaderCells.push(<th key='feathead3' style={{textAlign: 'center', width: '10%'}}>strand</th>);
            tableHeaderCells.push(<th key='null' style={{width: '10%'}}> </th>);

            annotationTableRows = [];
            for (let i = 0; i < annotations.length; i++) {
                let annotationTableCells = [];
                let annotation = annotations[i];

                for (var j = 0; j < tableHeaderCells.length - 1; j++) {
                    let column = tableHeaderCells[j].props.children.toString();
                    let cellStyle = {};
                    let cellEntry = '';

                    if (annotation[column] !== null && annotation[column] !== undefined) {
                        cellStyle = {};
                        cellEntry = annotation[column].toString();
                    }
                    if (column === 'position') {
                        cellStyle = {};
                        cellEntry = annotation['start'] + " - " + annotation['end'];
                    }
                    if (column === 'strand') {
                        cellStyle = {textAlign: 'center'};
                        if (annotation['forward']) {
                            cellEntry = "+";
                        } else {
                            cellEntry = "-";
                        }
                    }
                    annotationTableCells.push(<td style={cellStyle} key={j} onClick={this.onFeatureSelection.bind(this, i)}>{ cellEntry }</td>);
                }
                var rowStyle = { backgroundColor: 'white' };
                if (this.state.selectedFeatures.indexOf(i) !== -1) {
                    rowStyle = { backgroundColor: '#E1E1E1' };
                    let cellStyle = {textAlign: 'center', cursor: 'pointer'};
                    var editCell = <td key={j+1}>
                                        <IconButton
                                            onClick={this.onEditIconClick.bind(this, i)}
                                            tooltip="edit"
                                            >
                                            <EditIcon style={{width: '18px', height: '18px'}}/>
                                        </IconButton>
                                   </td>;
                    annotationTableCells.push(editCell);
                } else {
                    annotationTableCells.push(<td onClick={this.onFeatureSelection.bind(this, i)}></td>);
                }
                annotationTableRows.push(<tr style={rowStyle} key={i}>{ annotationTableCells }</tr>);
            }

            // controls
            if (!readOnly) {
                var featureControls = (
                    <div className={styles.controls}>
                        <IconButton
                            onTouchTap={this.openAddFeatureDisplay.bind(this)}
                            tooltip="add"
                            >
                            <AddBoxIcon />
                        </IconButton>

                        <IconButton onClick={this.deleteFeatures.bind(this)} disabled={this.state.selectedFeatures.length === 0} tooltip={"delete"}>
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
            tableHeaderCells.push(<th key='cuthead1' style={{textAlign: 'center'}}># cuts</th>);
            tableHeaderCells.push(<th key='cuthead2' style={{width: '40%'}}>position</th>);
            tableHeaderCells.push(<th key='cuthead3' style={{textAlign: 'center'}}>strand</th>);

            annotationTableRows = [];
            var color = '#FFFFFF';
            for (var enzyme in annotations) { // this is an object so we loop differently
                let annotationTableCells = [];
                let annotation = annotations[enzyme];
                // first loop for enzyme name and number of cuts + first cut
                for (let j = 0; j < 4; j++) {
                    let column = tableHeaderCells[j].props.children.toString();
                    let cellStyle = {};
                    let cellEntry = '';
                    let cut = annotation[0];

                    if(column === 'name') {
                        cellStyle = {};
                        cellEntry = enzyme;
                    }
                    if (column === '# cuts') {
                        cellStyle = {textAlign: 'center'};
                        cellEntry = annotation.length;
                    }
                    if (column === 'position') {
                        cellEntry = cut['start'] + " - " + cut['end'];

                    }
                    if (column === 'strand') {
                        cellStyle = {textAlign: 'center'};
                        if (cut['forward']) {
                            cellEntry = "+";
                        } else {
                            cellEntry = "-";
                        }
                    }
                    annotationTableCells.push(<td style={cellStyle} key={j}>{ cellEntry }</td>);
                }
                color = color === '#F0F0F0' ? '#FFFFFF' : '#F0F0F0';
                annotationTableRows.push(<tr style={{backgroundColor: color}}>{ annotationTableCells }</tr>);

                annotationTableCells = [];
                // sub loop for each additional cut
                for (var j=1; j<annotation.length; j++) {
                    for (let k = 0; k < 4; k++) {
                        let column = tableHeaderCells[k].props.children.toString();
                        let cellEntry = '';
                        let cellStyle = {};
                        let cut = annotation[j];

                        // if it's name or number of cuts it'll stay blank
                        if (column === 'position') {
                            cellEntry = cut['start'] + " - " + cut['end'];

                        }
                        if (column === 'strand') {
                            cellStyle = {textAlign: 'center'};
                            if (cut['forward']) {
                                cellEntry = "+";
                            } else {
                                cellEntry = "-";
                            }
                        }
                        annotationTableCells.push(<td style={cellStyle} key={k}>{ cellEntry }</td>);
                    }
                    annotationTableRows.push(<tr style={{backgroundColor: color}}>{ annotationTableCells }</tr>);
                    annotationTableCells = [];
                }
            }
        }

        // ORFS TAB
        if (sidebarType === 'Orfs') {
            tableHeaderCells = [];
            tableHeaderCells.push(<th key='orfhead0'>position</th>);
            tableHeaderCells.push(<th key='orfhead1'>length</th>);
            tableHeaderCells.push(<th key='orfhead2' style={{textAlign: 'center'}}>strand</th>);
            tableHeaderCells.push(<th key='orfhead3' style={{textAlign: 'center'}}>frame</th>);

            annotationTableRows = [];
            for (let i = 0; i < annotations.length; i++) {
                let annotationTableCells = [];
                let annotation = annotations[i];

                for (let j = 0; j < tableHeaderCells.length; j++) {
                    let column = tableHeaderCells[j].props.children;
                    let cellEntry = '';
                    let cellStyle = {};

                    if (column === 'position') {
                        cellStyle = {};
                        cellEntry = annotation['start'] + " - " + annotation['end'];
                    }  else
                    if (column === 'strand') {
                        cellStyle = {textAlign: 'center'};
                        if (annotation['forward']) {
                            cellEntry = "+";
                        } else {
                            cellEntry = "-";
                        }
                    } else
                    if (column === 'frame') {
                        cellStyle = {textAlign: 'center'};
                        cellEntry = annotation[column].toString();
                    } else
                    if (annotation[column] !== null && annotation[column] !== undefined) {
                        cellStyle = {};
                        cellEntry = annotation[column].toString();
                    }

                    annotationTableCells.push(<td style={cellStyle} key={j}>{ cellEntry }</td>);
                }
                var rowStyle = {backgroundColor: this.highlightOrf(i)};
                annotationTableRows.push(<tr style={rowStyle} key={i} onClick={this.onOrfSelection.bind(this, i)}>{annotationTableCells}</tr>);
            }
            var orfControls = (
                <div className={styles.controls}>
                    Minimum ORF Size: { minimumOrfSize }
                    { readOnly ? null :
                        <div id='orfControl' onClick={function() {signals.showChangeMinOrfSizeDialog()}}
                            className={styles.orfControl}> Change </div>
                    }
                    { showOrfModal ?
                        <div id='orfModal' className={styles.orfModal}>
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

        //FEATURE DETAIL
        if (this.state.editFeature  > -1 && sidebarType === "Features") {
            let idx = this.state.editFeature;
            let annotation = annotations[idx];

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

                <div className={styles.tableContainer}>
                    <table ref="sideBar">
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
