// React
import React, { PropTypes } from 'react';

// Cerebral
import { Decorator as Cerebral } from 'cerebral-view-react';
import RestrictionEnzymeManager from './RestrictionEnzymeManager';

// Material UI
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import InputIcon from 'material-ui/lib/svg-icons/action/input';
import SearchIcon from 'material-ui/lib/svg-icons/action/search';
import FileIcon from 'material-ui/lib/svg-icons/editor/insert-drive-file';
import SaveIcon from 'material-ui/lib/svg-icons/action/backup';
import downloadIcon from 'material-ui/lib/svg-icons/file/file-download';
import uploadIcon from 'material-ui/lib/svg-icons/file/file-upload';
import PrintIcon from 'material-ui/lib/svg-icons/action/print';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TextField from 'material-ui/lib/text-field';
import EnzymesIcon from 'material-ui/lib/svg-icons/action/track-changes';

@Cerebral({
    embedded: ['embedded'],
    readOnly: ['readOnly'],
    showOrfs: ['showOrfs'],
    showCutsites: ['showCutsites'],
    showParts: ['showParts'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showSidebar: ['showSidebar']
})

export default class ToolBar extends React.Component {

    search() {
        this.props.signals.searchSequence({ searchString: this.refs.searchField.getValue() });
    }

    clearSearch() {
        this.props.signals.searchSequence({ searchString: "" });
    }

    render() {
        var {
            embedded,
            readOnly,
            showFeatures,
            showParts,
            showTranslations,
            showOrfs,
            showCutsites,
            showSidebar,
            signals
        } = this.props;

        var dialog = (
            <RestrictionEnzymeManager />
        );

        // show/hide views buttons that only appear in embedded mode
        var embeddedControls = (
            embedded ? 
                <div style={{display: 'inline-block'}}>
                <RaisedButton
                    label='Row'
                    onTouchTap={function() {
                        document.getElementById("circularView").setAttribute("style", "display: none");
                        document.getElementById("rowView").setAttribute("style", "display: block"); 
                    }}
                />
                <RaisedButton
                    label='Map'
                    onTouchTap={function() {
                        document.getElementById("circularView").setAttribute("style", "display: block");
                        document.getElementById("rowView").setAttribute("style", "display: none");                        
                    }}
                />
                </div> : null
        )

        // upload and download files items
        var fileMenuItems = (
            <div>
                <MenuItem key={1} primaryText="Download SBOL" insetChildren={true} onClick={function () {
                    signals.clickSaveFile({fileExt: 'sbol'});
                }} />
                <MenuItem key={2} primaryText="Download GenBank" insetChildren={true} onClick={function () {
                    signals.clickSaveFile({fileExt: 'genbank'});
                }} />
                <MenuItem key={3} primaryText="Download Fasta" insetChildren={true} onClick={function () {
                    signals.clickSaveFile({fileExt: 'fasta'});
                }} />
                <MenuItem key={4} primaryText="Upload from file ..." insetChildren={true} onClick={function () {
                    signals.clickLoadFile();
                }} />         
            </div>
        );

        var fileButtonElement = (
            <IconButton tooltip="File">
                <FileIcon />
            </IconButton>
        );

        var dialogButtonElement = (
            <IconButton tooltip="Restriction Enzyme Manager">
                <EnzymesIcon />
            </IconButton>
        );

        // jsx styling syntax is really screwy!
        var disabledStyle = {opacity: '.5'};
        var toggleStyles = {display: 'inline-block', fontSize: '16px', fontWeight: 'bold', verticalAlign: 'top'}
        var buttonStyles = {position: 'relative', display: 'inline-block', padding: '10px 16px', margin: '6px 10px', border: '1px solid black', borderRadius: '4px'}
        // show or hide features &c
        var toggleFeatures = (
            <div style={ toggleStyles }>
                <div style={ showFeatures ? buttonStyles : Object.assign(disabledStyle, buttonStyles) } id='toggleFeatures' onClick={function () {
                    signals.toggleAnnotationDisplay({type: 'Features'});
                }}> F </div>
                <div style={ showCutsites ? buttonStyles : Object.assign(disabledStyle, buttonStyles) } id='toggleCutsites' onClick={function () {
                    signals.toggleAnnotationDisplay({type: 'Cutsites'});
                }}> C </div>
                <div style={ showOrfs ? buttonStyles : Object.assign(disabledStyle, buttonStyles) } id='toggleOrfs' onClick={function () {
                    signals.toggleAnnotationDisplay({type: 'Orfs'});
                }}> O </div>
            </div>
        );

        // pulls out the current view and necessary resizing js to a new tab 
        // and applies some styling to cleanup for print version
        var prepPrintPage = function() {
            var contents = document.getElementById("allViews").innerHTML;
            var head = document.head.innerHTML;
            var stylePage = "<style>@page{margin: 1in;} .veSelectionLayer{display: none;} #circularView,#rowView{width: 8.5in; display: block;} #circularView{page-break-after: always;} #rowView>div{bottom: auto;}</style>";
            var printTab = window.open();
            printTab.document.body.innerHTML = head + stylePage + contents;
            printTab.document.close();
            printTab.focus();
            printTab.print();
            printTab.close();
        };

        return (
            <Toolbar>
                <ToolbarGroup key={0}>                    
                    <IconButton
                        label='Feature Details'
                        onTouchTap={function() {
                            signals.sidebarToggle();
                        }}
                        >
                        <InputIcon />
                    </IconButton>

                    { embeddedControls }

                    <IconButton
                        label='Print Current View'
                        onTouchTap={function() {
                            prepPrintPage();
                        }}
                        >
                        <PrintIcon />
                    </IconButton>       
                    <IconButton label='Search' onClick={this.search.bind(this)}>
                        <SearchIcon />
                    </IconButton>                                  
                    <TextField ref="searchField" hintText="search sequence" />

                    {toggleFeatures}

                    <IconButton
                        disabled={ readOnly }  // you can't save in read only
                        label='Save to Server'
                        onTouchTap={function() {
                            signals.saveChanges();
                        }}
                        >
                        <SaveIcon />
                    </IconButton>                   
                    <IconMenu iconButtonElement={fileButtonElement} openDirection="bottom-right">
                        {fileMenuItems}
                    </IconMenu>
                    <IconButton
                        label="Dialog"
                        tooltip='Manage Restriction Enzymes'
                        onTouchTap={function() {
                            signals.restrictionEnzymeManagerDisplay();
                        }}
                        >
                        <EnzymesIcon />
                    </IconButton>
                    {dialog}

                </ToolbarGroup>           
            
            </Toolbar>
        );
    }
}