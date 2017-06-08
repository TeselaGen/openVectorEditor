import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import Dialog from 'material-ui/lib/dialog';
import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';
import Checkbox from 'material-ui/lib/checkbox';
import ModeEdit from 'material-ui/lib/svg-icons/editor/mode-edit';
import ArrowDropDown from 'material-ui/lib/svg-icons/navigation/arrow-drop-down';
import SidebarDetail from './SidebarDetail';
import SidebarEdit from './SidebarEdit';
import styles from './side-bar.css'

var assign = require('lodash/object/assign');

@Cerebral({
    bpsPerRow: ['bpsPerRow'],
    showAddFeatureModal: ['showAddFeatureModal'],
    showOrfModal: ['showOrfModal'],
    minimumOrfSize: ['minimumOrfSize'],
    readOnly: ['readOnly'],
    sidebarType: ['sidebarType'],
    selectionLayer: ['selectionLayer'],
    sequenceLength: ['sequenceLength'],
    sequenceData: ['sequenceData'],
})

export default class SideBar extends React.Component {

    constructor() {
        super(arguments);
        this.state = {
            editFeature: -1,
            featureError: '',
            featureOrder: 'name',
            cutsiteOrder: 'name',
            orfOrder: 'start',
            newFeature: {},
            selectedCutsites: [],
            selectedFeatures: [],
            selectedOrfs: [],
            shiftedFeatures: [],
        };
    }

    componentWillReceiveProps(newProps) {
        let signals = this.props.signals;

        var shiftedFeatures = [];
        if (this.props.annotationType === 'Features') {
            var featureCopy;
            for (var i=0; i<this.props.annotations.length; i++) {
                featureCopy = Object.assign({}, this.props.annotations[i]);
                featureCopy.start += 1;
                featureCopy.end += 1;
                shiftedFeatures.push(featureCopy);
            }
            this.setState({ shiftedFeatures: shiftedFeatures });
        }

        if (newProps.selectionLayer.selected && newProps.selectionLayer.id && newProps.selectionLayer !== this.props.selectionLayer) {
            for (var key in newProps.annotations) {
                let annotation = newProps.annotations[key];

                // open sidebar to correct tab
                var type;
                if (annotation.numberOfCuts) {
                    type = 'Cutsites';
                } else if (annotation.internalStartCodonIndices) {
                    type = 'Orfs';
                } else if (annotation.name) {
                    type = 'Features';
                }

                // highlighting is stupid if the annotation's type isn't even being shown on the display
                if (type) {
                    signals.sidebarDisplay({ type: type });
                    signals.toggleAnnotationDisplay({ type: type, value: true });
                }

                if (annotation.id === newProps.selectionLayer.id) {
                    if (type === 'Features') {
                        this.setState({selectedFeatures: [annotation.id]});
                    }
                    if (type === 'Cutsites') {
                        this.setState({selectedCutsites: [annotation.id]});
                    }
                    if (type === 'Orfs') {
                        this.setState({selectedOrfs: [annotation.id]});
                    }
                }
            }

        // deselecting a feature/orf from the circular view clears selected annotations
        } else if (newProps.annotationType === 'Features' && this.state.selectedFeatures.length === 1){
            this.setState({selectedFeatures: []});
        } else if (newProps.annotationType === 'Cutsites' && this.state.selectedCutsites.length === 1) {
            this.setState({selectedCutsites: []});
        } else if (newProps.annotationType === 'Orfs' && this.state.selectedOrfs.length === 1) {
            this.setState({selectedOrfs: []});
        }
    }

    selectAllNone(ids) {
        this.setState({editFeature: -1});
        this.props.signals.featureClicked({annotation: {}});
        if (this.props.annotationType === 'Features') {
            this.setState({selectedFeatures: ids});
        } else if (this.props.annotationType === 'Orfs') {
            this.setState({selectedOrfs: ids});
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
        if (this.state.selectedFeatures.length === 1) {
            this.annotationHighlight(selected[0]);
        } else {
            this.annotationHighlight(null);
        }
    }

    onCutsiteSelection(id) {
        let selected = this.state.selectedCutsites;
        let idx = selected.indexOf(id);
        if (idx === -1) {
            selected.push(id);
        } else {
            selected.splice(idx, 1);
        }
        this.setState({ selectedCutsites: selected });

        if (selected.length === 1) {
            this.annotationHighlight(selected[0]);
        } else {
            this.annotationHighlight(null);
        }
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

        if (selected.length === 1) {
            this.annotationHighlight(selected[0]);
        } else {
            this.annotationHighlight(null);
        }
    }

    annotationHighlight(id) {
        let signals = this.props.signals;
        let bpsPerRow = this.props.bpsPerRow;
        if (id) {
            let annotations = this.props.annotations;
            for (var i=0; i<annotations.length; i++) {
                if (annotations[i].id === id) {
                    var annotation = annotations[i];
                    break;
                }
            }
            var row = Math.floor((annotation.start-1)/(bpsPerRow));
            row = row <= 0 ? "0" : row;
            signals.jumpToRow({rowToJumpTo: row});
            signals.featureClicked({annotation: annotation});
        } else {
            signals.featureClicked({annotation: {}});
        }
    }

    onEditIconClick(id) {
        this.setState({ selectedFeatures: [id], editFeature: id })
        this.annotationHighlight(id);
    }

    editFeature(currentFeature) {
        if (currentFeature.badType) {
            this.setState({ featureError: 'Unrecognized feature type' });
            return;
        }
        var featureCopy = Object.assign({}, currentFeature);
        featureCopy.start -= 1;
        featureCopy.end -= 1;
        this.setState({ editFeature: -1 });
        this.props.signals.updateFeature({ feature: featureCopy });
        this.props.signals.featureClicked({ annotation: featureCopy });
    }

    closeErrorDialog() {
        this.setState({featureError: ''});
    }

    deleteFeatures() {
        var featureIds = this.state.selectedFeatures;
        this.props.signals.featureClicked({annotation: {}});
        this.props.signals.deleteFeatures({ featureIds: featureIds });
        this.setState({ selectedFeatures: [] });
        this.annotationHighlight(null);
    }

    openAddFeatureDisplay() {
        this.setState({ editFeature: -1, selectedFeatures: [] });
        // this.annotationHighlight(null);
        this.props.signals.addFeatureModalDisplay();
    }

    createFeature(newFeature) {
        this.setState({ newFeature: newFeature });
    }

    addFeature() {
        if (this.state.newFeature.badType) {
            this.setState({ featureError: 'Unrecognized feature type' });
            return;
        }
        let temporaryId = this.props.annotations.length;
        this.state.newFeature.id = temporaryId;
        this.props.signals.addFeatureModalDisplay();
        var featureCopy = Object.assign({}, this.state.newFeature);
        featureCopy.start -= 1;
        featureCopy.end -= 1;

        this.props.signals.addAnnotations({
            sidebarType: 'Features',
            annotationsToInsert: [featureCopy],
            thidErrors: true
        });
        this.setState({selectedFeatures: [temporaryId]});
        this.props.signals.featureClicked({annotation: featureCopy});
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
        var sortOrder = 1; // ascending sort
        if (column[0] === '-') {
            sortOrder = -1; // descending sort
            column = column.slice(1);
        }

        var arrowCSS = {
            "transform": ["scaleY(1)", "scaleY(-1)"],
            "filter": ["", "FlipV"],
            "msFilter": ["", "'FlipV'"],
            "MozTransform": ["scaleY(1)", "scaleY(-1)"],
            "OTransform": ["scaleY(1)", "scaleY(-1)"],
            "WebkitTransform": ["scaleY(1)", "scaleY(-1)"],
            "fill": ["black !important"]
        };

        // flip arrow upside down
        var idx = sortOrder === 1 ? 0 : 1;
        let elementId = this.props.annotationType + '_' + column;
        var arrow = document.getElementById(elementId);
        if (arrow) {
            arrow.style.transform = arrowCSS["transform"][idx];
            arrow.style.filter = arrowCSS["filter"][idx];
            arrow.style.msFilter = arrowCSS["msFilter"][idx];
            arrow.style.MozTransform = arrowCSS["MozTransform"][idx];
            arrow.style.OTransform = arrowCSS["OTransform"][idx];
            arrow.style.WebkitTransform = arrowCSS["WebkitTransform"][idx];

            // and change color of table headers
            var headers = document.getElementsByTagName("th");
            for (let i=0; i<headers.length; i++) {
                headers[i].style.color = "black";
            }
            arrow.parentElement.style.color = "#00bcd4";
        }

        // actually sort
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
            minimumOrfSize,
            readOnly,
            signals,
            showAddFeatureModal,
            showOrfModal,
            selectionLayer,
            sidebarType,
            sequenceLength,
            sequenceData
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

        // maybe we want reset selectedFeatures/Orfs and selectionLayer on change tab? maybe we don't?
        var topTabs = (
            <div id='featureTabs' style={{display: 'flex', backgroundColor: '#ccc'}}>

                <div style={this.props.annotationType==='Features' ? selectedTabStyle : tabStyle}
                    onClick={function() {
                        if (this.props.annotationType !== 'Features') {
                            signals.featureClicked({annotation: {}});
                            this.setState({selectedFeatures: []});
                        }
                        signals.sidebarDisplay({ type: 'Features' })}.bind(this)}>
                    Features
                </div>

                <div style={this.props.annotationType==='Cutsites' ? selectedTabStyle : tabStyle}
                    onClick={function () {
                        signals.featureClicked({annotation: {}});
                        this.setState({selectedFeatures: []});
                        signals.sidebarDisplay({ type: 'Cutsites' })}.bind(this)}>
                    Cutsites
                </div>

                <div style={this.props.annotationType==='Orfs' ? selectedTabStyle : tabStyle}
                    onClick={function () {
                        if (this.props.annotationType !== 'Orfs') {
                            signals.featureClicked({annotation: {}});
                            this.setState({selectedFeatures: []});
                        }
                        signals.sidebarDisplay({ type: 'Orfs' })}.bind(this)}>
                    ORFs
                </div>

            </div>
        );

        // SELECT ALL / SELECT NONE
        var annotationIds = [];
        for (let i=0; i<annotations.length; i++) {
            annotationIds.push(annotations[i].id);
        }
        var selectAllNone = (
            <div className={styles.selectAllNoneContainer}>
                <a className={styles.selectAllNone} onClick={this.selectAllNone.bind(this, annotationIds)}>select all</a>
                <span>|</span>
                <a className={styles.selectAllNone} onClick={this.selectAllNone.bind(this, [])}>select none</a>
            </div>
        )

        // i'm taking off 'selectAllNone' from Orfs for now because there's no good place to put it
        // it gets in the way of orfcontrols at the moment
        if (this.props.annotationType === 'Cutsites' || this.props.annotationType === 'Orfs') {
            selectAllNone = <div></div>;
        }

        // FEATURE DETAIL
        var annotationForm;
        var sorted = this.state.shiftedFeatures.slice(0);
        sorted = sorted.sort(this.dynamicSort(this.state.featureOrder));

        if (this.state.editFeature > -1 && this.props.annotationType === "Features") {
            let id = this.state.editFeature;
            var annotation;
            var rowPosition;
            for (var i=0; i<sorted.length; i++) {
                if (sorted[i].id === id) {
                    annotation = sorted[i];
                    rowPosition = i;
                }
            }

            annotationForm = (
                <SidebarEdit
                    editFeature={this.editFeature.bind(this)}
                    sequenceLength={sequenceLength}
                    feature={annotation}
                    rowPosition={rowPosition}
                    totalFeatures={sorted.length}
                    />
            )
        }

        // FEATURES TAB
        if (this.props.annotationType === 'Features') {
            tableHeaderCells = [];
            tableHeaderCells.push(
                <th key='feathead0' style={{width:'28%', color:'black'}}>name
                    <IconButton onClick={this.onFeatureSort.bind(this, 'name')}
                    id='Features_name'
                    style={{verticalAlign:'middle', marginLeft:'-10px'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='feathead1' style={{width:'30%', color:'black'}}>type
                    <IconButton onClick={this.onFeatureSort.bind(this, 'type')}
                    id='Features_type'
                    style={{verticalAlign:'middle', marginLeft:'-10px'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='feathead2' style={{color:'black'}}>position
                    <IconButton onClick={this.onFeatureSort.bind(this, 'start')}
                    id='Features_start'
                    style={{verticalAlign:'middle', marginLeft:'-10px'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='feathead3' style={{textAlign:'center', width:'15%', color:'black'}}>strand
                    <IconButton onClick={this.onFeatureSort.bind(this, 'forward')}
                    id='Features_forward'
                    style={{verticalAlign:'middle', marginLeft:'-10px'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            // placeholder column for edit-icon
            tableHeaderCells.push(<th key='null' style={{minWidth: '48px'}}> </th>);

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
                            if (parseInt(annotation['strand']) === 1) {
                                cellEntry = "+";
                            } else {
                                cellEntry = "-";
                            }
                        }
                        if (cellEntry.length > 20) {
                            cellEntry = cellEntry.slice(0, 17) + "...";
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
                        rowStyle = { backgroundColor: 'lightblue' };
                        let cellStyle = {textAlign: 'center', cursor: 'pointer'};
                        var editCell = (
                            <td key={j+1}>
                                <IconButton
                                onClick={this.onEditIconClick.bind(this, sorted[i].id)}
                                tooltip="edit">
                                <ModeEdit style={{width: '18px', height: '18px'}}/>
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
                            tooltip="add"
                            tooltipPosition="top-center">
                            <AddBoxIcon />
                        </IconButton>

                        <IconButton
                            onClick={this.deleteFeatures.bind(this)}
                            disabled={this.state.selectedFeatures.length === 0}
                            tooltip={"delete"}
                            tooltipPosition="top-center">
                            <IndeterminateCheckBoxIcon />
                        </IconButton>
                    </div>
                );
            }
        }

        // CUTSITES TAB
        if (this.props.annotationType === 'Cutsites') {
            tableHeaderCells = [];
            tableHeaderCells.push(
                <th key='cuthead0' style={{color:'black'}}>name
                    <IconButton onClick={this.onCutsiteSort.bind(this, 'name')}
                    id='Cutsites_name'
                    style={{verticalAlign:'middle', marginLeft:'-10px'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='cuthead1' style={{textAlign:'center', color:'black'}}># cuts
                    <IconButton onClick={this.onCutsiteSort.bind(this, 'numberOfCuts')}
                    id='Cutsites_numberOfCuts'
                    style={{verticalAlign:'middle', marginLeft:'-10px'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='cuthead2' style={{width:'40%', color:'black'}}>position
                    <IconButton onClick={this.onCutsiteSort.bind(this, 'start')}
                    id='Cutsites_start'
                    style={{verticalAlign:'middle', marginLeft:'-10px'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='cuthead3' style={{textAlign:'center', color:'black'}}>strand
                    <IconButton onClick={this.onCutsiteSort.bind(this, 'forward')}
                    id='Cutsites_forward'
                    style={{verticalAlign:'middle', marginLeft:'-10px'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);

            var sorted = annotations.slice(0);
            sorted = sorted.sort(this.dynamicSort(this.state.cutsiteOrder));

            annotationTableRows = [];
            var color = '#FFFFFF';
            var highlight;

            for (var i=0; i<sorted.length; i++) {
                let annotationTableCells = [];
                let cut = sorted[i];

                // if the prev row was same enzyme, lump them together, leave off name & #cuts columns
                if (i>0 && sorted[i-1].name === sorted[i].name) {
                    for (let k = 0; k < 4; k++) {
                        let column = tableHeaderCells[k].props.children.toString().split(',')[0];
                        let cellEntry = '';
                        let cellStyle = {};

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
                        if (cellEntry.length > 20) {
                            cellEntry = cellEntry.slice(0, 17) + "...";
                        }
                        annotationTableCells.push(
                            <td style={cellStyle} key={k}>{ cellEntry }</td>);
                    }

                // otherwise, alternate background color and create new row with all columns
                } else {
                    color = color === '#F0F0F0' ? '#FFFFFF' : '#F0F0F0';
                    for (let j = 0; j < 4; j++) {
                        let column = tableHeaderCells[j].props.children.toString().split(',')[0];
                        let cellStyle = {};
                        let cellEntry = '';

                        if(column === 'name') {
                            cellStyle = {};
                            cellEntry = cut['name'];
                        }
                        if (column === '# cuts') {
                            cellStyle = {textAlign: 'center'};
                            cellEntry = cut['numberOfCuts'];
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
                        if (cellEntry.length > 20) {
                            cellEntry = cellEntry.slice(0, 17) + "...";
                        }
                        annotationTableCells.push(
                            <td style={cellStyle} key={j}>{ cellEntry }</td>);
                    }
                }

                if (this.state.selectedCutsites.indexOf(sorted[i].id) !== -1) {
                    highlight = 'lightblue';
                } else {
                    highlight = color;
                }

                annotationTableRows.push(
                    <tr key={i}
                        style={{backgroundColor: highlight}}
                        onClick={this.onCutsiteSelection.bind(this, sorted[i].id)}>
                        { annotationTableCells }
                    </tr>);
            }
        }

        // ORFS TAB
        if (this.props.annotationType === 'Orfs') {
            tableHeaderCells = [];
            tableHeaderCells.push(
                <th key='orfhead0' style={{color:'black'}}>position
                    <IconButton onClick={this.onOrfSort.bind(this, 'start')}
                    id='Orfs_start'
                    style={{verticalAlign:'middle', marginLeft:'-10px'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='orfhead1' style={{color:'black'}}>length
                    <IconButton onClick={this.onOrfSort.bind(this, 'length')}
                    id='Orfs_length'
                    style={{verticalAlign:'middle', marginLeft:'-10px'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='orfhead2' style={{textAlign:'center', color:'black'}}>strand
                    <IconButton onClick={this.onOrfSort.bind(this, 'forward')}
                    id='Orfs_forward'
                    style={{verticalAlign:'middle', marginLeft:'-10px'}}>
                    <ArrowDropDown/>
                    </IconButton>
                </th>);
            tableHeaderCells.push(
                <th key='orfhead3' style={{textAlign:'center', color:'black'}}>frame
                    <IconButton onClick={this.onOrfSort.bind(this, 'frame')}
                    id='Orfs_frame'
                    style={{verticalAlign:'middle', marginLeft:'-10px'}}>
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
                    if (cellEntry.length > 20) {
                        cellEntry = cellEntry.slice(0, 17) + "...";
                    }
                    annotationTableCells.push(
                        <td style={cellStyle} key={j}>{ cellEntry }</td>);
                }
                var rowStyle = { backgroundColor: 'white' };
                if (this.state.selectedOrfs.indexOf(sorted[i].id) !== -1) {
                    rowStyle = { backgroundColor: 'lightblue' };
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
                    key="cancel"
                    label="Cancel"
                    onTouchTap={function() {signals.addFeatureModalDisplay()}}
                    />
                <FlatButton
                    key="addFeature"
                    className={styles.saveButton}
                    label="Add Feature"
                    style={{color: "#03A9F4"}}
                    onTouchTap={this.addFeature.bind(this)}
                    disabled={
                        !this.state.newFeature['start'] || isNaN(this.state.newFeature['start']) ||
                        !this.state.newFeature['end'] || isNaN(this.state.newFeature['end']) ||
                        !this.state.newFeature['strand'] || isNaN(this.state.newFeature['strand']) ||
                        this.state.newFeature['start'] < 1 || this.state.newFeature['start'] > sequenceLength ||
                        this.state.newFeature['end'] < 1 || this.state.newFeature['end'] > sequenceLength ||
                        this.state.newFeature['strand']*this.state.newFeature['strand'] !== 1 ||
                        this.state.newFeature.badType
                    }
                    />
            </div>
        );

        var start = 1;
        var end = 1;
        if (selectionLayer.start > 0) {
            start = selectionLayer.start+1;
            end = selectionLayer.end+1;
        }
        var sidebarDetail = (
            <SidebarDetail
                createFeature={this.createFeature.bind(this)}
                sequenceLength={sequenceLength}
                feature = {{start: start, end: end, strand: -1, name: "", type: ""}}
                />
        );

        if (showAddFeatureModal) {
            var addFeatureDialog = (
                <Dialog
                    title="Add New Feature"
                    autoDetectWindowHeight={false}
                    autoScrollBodyContent={false}
                    open={showAddFeatureModal}
                    style={{position: 'absolute', maxWidth: '500px', top: "0px", bottom: "0px", paddingTop: '10% !important'}}
                    titleStyle={{paddingBottom: "0px"}}
                    >
                    { sidebarDetail }
                    { actions }
                </Dialog>
            );
        }

        var errorDialog = (
            <Dialog
                open={this.state.featureError.length > 0}
                onRequestClose={this.closeErrorDialog.bind(this)}
                style={{height: '500px', position: 'absolute', maxWidth: '500px'}}
                actions={[<FlatButton key="cancel" onClick={this.closeErrorDialog.bind(this)}>ok</FlatButton>]}
                >
                {this.state.featureError}
            </Dialog>
        );

        return (
            <div>

                { topTabs }

                <div className={styles.tableContainer} id="tableContainer">
                    <table ref="sideBar">
                        <thead><tr>{ tableHeaderCells }</tr></thead>
                        <tbody>{ annotationTableRows }</tbody>
                    </table>
                </div>

                { featureControls }

                { orfControls }

                { selectAllNone }

                { errorDialog }

                { addFeatureDialog }

            </div>
        );
    }
}
