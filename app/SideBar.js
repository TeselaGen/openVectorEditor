import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

// {{}} remove this.state and do it correctly
import Dialog from 'material-ui/lib/dialog';
import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';
import Checkbox from 'material-ui/lib/checkbox';
import EditIcon from 'material-ui/lib/svg-icons/edit-icon';
import ArrowDropDown from 'material-ui/lib/svg-icons/navigation/arrow-drop-down';
import ArrowDropUp from 'material-ui/lib/svg-icons/navigation/arrow-drop-up';

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
            sidebarType: 'Features',
            selectedFeatures: [],
            selectedOrfs: [],
            newFeature: {},
            editfeature: -1,
            featureOrder: 'name',
            cutsiteOrder: 'name',
            orfOrder: 'start',
        };
    }

    selectAll(ids) {
        this.setState({editFeature: -1});
        if (this.state.sidebarType === 'Features') {
            this.setState({selectedFeatures: ids});
        } else if (this.state.sidebarType === 'Orfs') {
            this.setState({selectedOrfs: ids});
        }
    }

    selectNone() {
        if (this.state.sidebarType === 'Features') {
            this.setState({selectedFeatures: []});
        } else if (this.state.sidebarType === 'Orfs') {
            this.setState({selectedOrfs: []});
        }
    }

    onFeatureSelection(id) {
        if (this.state.editFeature > -1) {
            this.setState({ editFeature: -1 });
        }
        let selected = this.state.selectedFeatures;
        let idx = selected.indexOf(id);
        if (idx === -1) {
            selected.push(id);
        } else {
            selected.splice(idx, 1);
        }
        this.setState({ selectedFeatures: selected });
    }

    onOrfSelection(id) {
        let selected = this.state.selectedOrfs;
        let idx = selected.indexOf(id);
        if (idx === -1) {
            selected.push(id);
        } else {
            selected.splice(idx, 1);
        }
        this.setState({ selectedOrfs: selected });
    }

    onEditIconClick(id) {
        this.setState({ selectedFeatures: [id], editFeature: id })
    }

    editFeature(currentFeature) {
        this.props.signals.updateFeature({
            feature: currentFeature
        });
        this.setState({ selectedFeatures: [], editFeature: -1 })
    }

    deleteFeatures() {
        var featureIds = this.state.selectedFeatures;
        this.props.signals.deleteFeatures({ featureIds: featureIds });
        this.setState({ selectedFeatures: [] });
    }

    openAddFeatureDisplay() {
        this.setState({ editFeature: -1 });
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
            thidErrors: true
        });
        this.props.signals.addFeatureModalDisplay();
    }

    onFeatureSort(column) {
        if (column === this.state.featureOrder) {
            column = '-' + column; // descending sort
        }
        this.setState({ featureOrder: column, editFeature: -1 });
    }

    onCutsiteSort(column) {
        if (column === this.state.cutsiteOrder) {
            column = '-' + column; // descending sort
        }
        this.setState({ cutsiteOrder: column });
    }

    onOrfSort(column) {
        if (column === this.state.orfOrder) {
            column = '-' + column; // descending sort
        }
        this.setState({ orfOrder: column });
    }

    dynamicSort(column) {
        // ascending sort
        var sortOrder = 1;

        // descending sort
        if (column[0] === '-') {
            sortOrder = -1;
            column = column.slice(1);
        }
        return function (a,b) {
            if (typeof a[column] === 'string') {
                a = a[column].toLowerCase();
                b = b[column].toLowerCase();
            } else {
                a = a[column];
                b = b[column];
            }
            return (a < b) ? -1*sortOrder : (a > b) ? sortOrder : 0;
        }
    }

    render() {
        var {
            annotations,
            cutsites,
            minimumOrfSize,
            readOnly,
            signals,
            showAddFeatureModal,
            showOrfModal
        } = this.props;
        var sidebarContent;
        var controls;
        var tableHeaderCells;
        var annotationTableRows;

        // TABS
        var tabStyle = {
            textAlign: 'center',
            flexGrow: '1',
            padding: '10px 30px',
            fontSize: '16px'
        };
        var selectedTabStyle = {};
        Object.assign(
            selectedTabStyle,
            tabStyle, {
                backgroundColor: 'white',
                borderTopRightRadius: '4px',
                borderTopLeftRadius: '4px'
            }
        );

        var topTabs = (
            <div id='featureTabs' style={{display: 'flex', backgroundColor: '#ccc'}}>

                <div style={this.state.sidebarType==='Features' ? selectedTabStyle : tabStyle}
                    onClick={function() {
                        this.setState({sidebarType: 'Features'});
                        signals.sidebarDisplay({ type: 'Features' });
                    }.bind(this)}>
                    Features
                </div>

                <div style={this.state.sidebarType==='Cutsites' ? selectedTabStyle : tabStyle}
                    onClick={function () {
                        this.setState({sidebarType: 'Cutsites', editFeature: -1});
                        signals.sidebarDisplay({ type: 'Cutsites' });
                    }.bind(this)}>
                    Cutsites
                </div>

                <div style={this.state.sidebarType==='Orfs' ? selectedTabStyle : tabStyle}
                    onClick={function () {
                        this.setState({sidebarType: 'Orfs', editFeature: -1});
                        signals.sidebarDisplay({ type: 'Orfs' });
                    }.bind(this)}>
                    ORFs
                </div>

            </div>
        );

        // SELECT ALL / SELECT NONE CHECKBOX
        var selectAllNone = <div></div>;
        var annotationIds = [];
        for (let i=0; i<annotations.length; i++) {
            annotationIds.push(annotations[i].id);
        }
        var selectAll = (
            <IconButton tooltip='select all'
                style={{position: 'absolute', top: '35px', width: '40px', zIndex: '5'}}>
                <Checkbox onCheck={this.selectAll.bind(this, annotationIds)}></Checkbox>
            </IconButton>
        )
        var selectNone = (
            <IconButton tooltip='select none'
                style={{position: 'absolute', top: '35px', width: '40px', zIndex: '5'}}>
                <Checkbox onCheck={this.selectNone.bind(this)}></Checkbox>
            </IconButton>
        )

        if (this.state.sidebarType === 'Features' &&
            this.state.selectedFeatures.length !== annotationIds.length) {
            selectAllNone = selectAll;
        } else if (this.state.sidebarType === 'Features') {
            selectAllNone = selectNone;
        }

        if (this.state.sidebarType === 'Orfs' &&
            this.state.selectedOrfs.length !== annotationIds.length) {
            selectAllNone = selectAll;
        } else if (this.state.sidebarType === 'Orfs') {
            selectAllNone = selectNone;
        }

        // FEATURE DETAIL
        var annotationForm;
        if (this.state.editFeature > -1 && this.state.sidebarType === "Features") {
            let id = this.state.editFeature;
            var annotation;
            for (var i=0; i<annotations.length; i++) {
                if (annotations[i].id === id)
                annotation = annotations[i];
            }

            annotationForm = (
                <SidebarEdit
                    editFeature={this.editFeature.bind(this)}
                    feature={ annotation }
                    />
            )
        }

        // FEATURES TAB
        if (this.state.sidebarType === 'Features') {
            tableHeaderCells = [];
            tableHeaderCells.push(
                <th key='feathead0' style={{width: '30%'}}>name
                    <IconButton onClick={this.onFeatureSort.bind(this, 'name')}
                    style={{verticalAlign: 'middle'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='feathead1' style={{width: '30%'}}>type
                    <IconButton onClick={this.onFeatureSort.bind(this, 'type')}
                    style={{verticalAlign: 'middle'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='feathead2'>position
                    <IconButton onClick={this.onFeatureSort.bind(this, 'start')}
                    style={{verticalAlign: 'middle'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='feathead3' style={{textAlign: 'center', width: '10%'}}>strand
                    <IconButton onClick={this.onFeatureSort.bind(this, 'forward')}
                    style={{verticalAlign: 'middle'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            // placeholder column for edit-icon
            tableHeaderCells.push(<th key='null' style={{minWidth: '48px'}}> </th>);

            var sorted = annotations.slice(0);
            sorted = sorted.sort(this.dynamicSort(this.state.featureOrder));

            annotationTableRows = [];
            for (let i = 0; i < sorted.length; i++) {
                let annotationTableCells = [];
                let annotation = sorted[i];
                if (this.state.editFeature > -1 && annotation.id === this.state.editFeature) {
                    annotationTableRows[i] = annotationForm;

                } else {

                    for (var j = 0; j < tableHeaderCells.length - 1; j++) {
                        let column = tableHeaderCells[j].props.children.toString().split(',')[0];
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
                        annotationTableCells.push(
                            <td style={cellStyle} key={j}
                                onClick={this.onFeatureSelection.bind(this, sorted[i].id)}>
                                { cellEntry }
                            </td>);
                    }

                    // show edit-icon if row is selected
                    var rowStyle = { backgroundColor: 'white' };
                    if (this.state.selectedFeatures.indexOf(sorted[i].id) !== -1) {
                        rowStyle = { backgroundColor: '#E1E1E1' };
                        let cellStyle = {textAlign: 'center', cursor: 'pointer'};
                        var editCell = (
                            <td key={j+1}>
                                <IconButton
                                onClick={this.onEditIconClick.bind(this, sorted[i].id)}
                                tooltip="edit">
                                <EditIcon style={{width: '18px', height: '18px'}}/>
                                </IconButton>
                           </td>);
                        annotationTableCells.push(editCell);
                    } else {
                        annotationTableCells.push(
                            <td key={j+1}
                                onClick={this.onFeatureSelection.bind(this, sorted[i].id)}>
                            </td>);
                    }

                    annotationTableRows.push(
                        <tr style={rowStyle} key={i}>{ annotationTableCells }</tr>);
                }
            }

            // add / delete features controls
            if (!readOnly) {
                var featureControls = (
                    <div className={styles.controls}>
                        <IconButton
                            onTouchTap={this.openAddFeatureDisplay.bind(this)}
                            tooltip="add">
                            <AddBoxIcon />
                        </IconButton>

                        <IconButton
                            onClick={this.deleteFeatures.bind(this)}
                            disabled={this.state.selectedFeatures.length === 0}
                            tooltip={"delete"}>
                            <IndeterminateCheckBoxIcon />
                        </IconButton>
                    </div>
                );
            }
        }

        // CUTSITES TAB
        if (this.state.sidebarType === 'Cutsites') {
            tableHeaderCells = [];
            tableHeaderCells.push(
                <th key='cuthead0'>name
                    <IconButton onClick={this.onFeatureSort.bind(this, 'name')}
                    style={{verticalAlign: 'middle'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='cuthead1' style={{textAlign: 'center'}}># cuts
                    <IconButton onClick={this.onFeatureSort.bind(this, 'numberOfCuts')}
                    style={{verticalAlign: 'middle'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='cuthead2' style={{width: '40%'}}>position
                    <IconButton onClick={this.onFeatureSort.bind(this, 'start')}
                    style={{verticalAlign: 'middle'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='cuthead3' style={{textAlign: 'center'}}>strand
                    <IconButton onClick={this.onFeatureSort.bind(this, 'forward')}
                    style={{verticalAlign: 'middle'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);

            // this is horrible and nasty and i'm sorry. i'm trying to sort by an attribute of an object, in an array, in a hash...
            var sorted = Object.assign({}, annotations);
            if (this.state.cutsiteOrder !== 'name') {

                // turning hash into an array to be sorted
                var array = [];
                for (var key in sorted) {
                    let numberOfCuts = sorted[key].length
                    for (var i=0; i<numberOfCuts; i++) {
                        let obj = Object.assign({}, sorted[key][i]);
                        obj.name = key;
                        obj.numberOfCuts = numberOfCuts;
                        array.push(obj);
                    }
                }
                array = array.sort(this.dynamicSort(this.state.cutsiteOrder));

                // turning array back into hash for rendering
                sorted = {};
                for (var j=0; j<array.length; j++) {
                    let name = array[j].name;

                    // a hacky workaround for creating multiple entries with the same key
                    while (sorted[name]) {
                        name = name + " ";
                    }

                    sorted[name] = [array[j]];
                }
            }

            annotationTableRows = [];
            var color = '#FFFFFF';
            for (var enzyme in sorted) { // this is an object so we loop differently
                let annotationTableCells = [];
                let annotation = sorted[enzyme];
                // first loop for enzyme name and number of cuts + first cut
                for (let j = 0; j < 4; j++) {
                    let column = tableHeaderCells[j].props.children.toString().split(',')[0];
                    let cellStyle = {};
                    let cellEntry = '';
                    let cut = annotation[0];

                    if(column === 'name') {
                        cellStyle = {};
                        cellEntry = enzyme;
                    }
                    if (column === '# cuts') {
                        cellStyle = {textAlign: 'center'};
                        cellEntry = cut['numberOfCuts'] || annotation.length;
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
                    annotationTableCells.push(
                        <td style={cellStyle} key={j}>{ cellEntry }</td>);
                }
                color = color === '#F0F0F0' ? '#FFFFFF' : '#F0F0F0';
                annotationTableRows.push(
                    <tr key={annotation.id}
                        style={{backgroundColor: color}}>
                        { annotationTableCells }
                    </tr>);

                annotationTableCells = [];
                // sub loop for each additional cut
                for (var j=1; j<annotation.length; j++) {
                    for (let k = 0; k < 4; k++) {
                        let column = tableHeaderCells[k].props.children.toString().split(',')[0];
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
                        annotationTableCells.push(
                            <td style={cellStyle} key={k}>{ cellEntry }</td>);
                    }
                    annotationTableRows.push(
                        <tr key={annotation.id+'.'+j} style={{backgroundColor: color}}>
                            { annotationTableCells }
                        </tr>);

                    annotationTableCells = [];
                }
            }
        }

        // ORFS TAB
        if (this.state.sidebarType === 'Orfs') {
            tableHeaderCells = [];
            tableHeaderCells.push(
                <th key='orfhead0'>position
                    <IconButton onClick={this.onFeatureSort.bind(this, 'start')}
                    style={{verticalAlign: 'middle'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='orfhead1'>length
                    <IconButton onClick={this.onFeatureSort.bind(this, 'length')}
                    style={{verticalAlign: 'middle'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='orfhead2' style={{textAlign: 'center'}}>strand
                    <IconButton onClick={this.onFeatureSort.bind(this, 'forward')}
                    style={{verticalAlign: 'middle'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='orfhead3' style={{textAlign: 'center'}}>frame
                    <IconButton onClick={this.onFeatureSort.bind(this, 'frame')}
                    style={{verticalAlign: 'middle'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);

            var sorted = annotations.slice(0);
            sorted = sorted.sort(this.dynamicSort(this.state.orfOrder));

            annotationTableRows = [];
            for (let i = 0; i < sorted.length; i++) {
                let annotationTableCells = [];
                let annotation = sorted[i];

                for (let j = 0; j < tableHeaderCells.length; j++) {
                    let column = tableHeaderCells[j].props.children.toString().split(',')[0];
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

                    annotationTableCells.push(
                        <td style={cellStyle} key={j}>{ cellEntry }</td>);
                }
                var rowStyle = { backgroundColor: 'white' };
                if (this.state.selectedOrfs.indexOf(sorted[i].id) !== -1) {
                    rowStyle = { backgroundColor: '#E1E1E1' };
                }
                annotationTableRows.push(
                    <tr style={rowStyle} key={i}
                        onClick={this.onOrfSelection.bind(this, sorted[i].id)}>
                        {annotationTableCells}
                    </tr>);
            }

            // orf controls
            var orfControls = (
                <div className={styles.controls}>
                    Minimum ORF Size: { minimumOrfSize }
                    { readOnly ? null :
                        <div id='orfControl'
                            onClick={function() {signals.showChangeMinOrfSizeDialog()}}
                            className={styles.orfControl}> Change </div>
                    }
                    { showOrfModal ?
                        <div id='orfModal' className={styles.orfModal}>
                            <input id='orfInput' type='number' defaultValue={minimumOrfSize}/>
                            <button name='setOrfMin' onTouchTap={function () {
                                var newMinVal = document.getElementById('orfInput').value;
                                signals.changeOrfMin({ newMin: newMinVal });
                                signals.showChangeMinOrfSizeDialog();
                            }}>Set</button>
                            <button name='closeOrfModal'
                                onClick={function() {signals.showChangeMinOrfSizeDialog()}}>
                                Cancel
                            </button>
                        </div> : null
                    }
                </div>
            );
        }

        // add feature modal
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

        return (
            <div>

                { topTabs }

                { selectAllNone }

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
