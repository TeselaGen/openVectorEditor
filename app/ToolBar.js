// React
import React, { PropTypes } from 'react';

// Cerebral
import { Decorator as Cerebral } from 'cerebral-view-react';

// Material UI
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import InputIcon from 'material-ui/lib/svg-icons/action/input';
import SearchIcon from 'material-ui/lib/svg-icons/action/search';
import FileIcon from 'material-ui/lib/svg-icons/editor/insert-drive-file';
import SaveIcon from 'material-ui/lib/svg-icons/action/backup';
import DownloadIcon from 'material-ui/lib/svg-icons/file/file-download';
import UploadIcon from 'material-ui/lib/svg-icons/file/file-upload';
import GelIcon from 'material-ui/lib/svg-icons/communication/clear-all';
import PrintIcon from 'material-ui/lib/svg-icons/action/print';
import CircularIcon from 'material-ui/lib/svg-icons/device/data-usage';
import RailIcon from 'material-ui/lib/svg-icons/hardware/power-input';
import RowIcon from 'material-ui/lib/svg-icons/content/text-format';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TextField from 'material-ui/lib/text-field';
import EnzymesIcon from 'material-ui/lib/svg-icons/action/track-changes';

import RestrictionEnzymeManager from './RectrictionEnzymeManager/RestrictionEnzymeManager';
import DigestionSimulation from './GelDigest/DigestionSimulation';

@Cerebral({
    embedded: ['embedded'],
    readOnly: ['readOnly'],
    showOrfs: ['showOrfs'],
    showCutsites: ['showCutsites'],
    showParts: ['showParts'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showSidebar: ['showSidebar'],
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
            signals,
        } = this.props;

        var dialog = (
            <RestrictionEnzymeManager />
        );

        var gelModal = (
            <DigestionSimulation/>
        );

        // show/hide views buttons that only appear in embedded mode
        var embeddedControls = (
            <div style={{display: 'inline-block'}}>
                <IconButton
                    onTouchTap={function() {
                        document.getElementById("circularView").setAttribute("style", "display: none");
                        document.getElementById("rowView").setAttribute("style", "display: block"); 
                    }}
                    >
                    <RowIcon />
                </IconButton>
                <IconButton
                    // not set up yet
                    >
                    <RailIcon />
                </IconButton>                
                <IconButton
                    onTouchTap={function() {
                        document.getElementById("circularView").setAttribute("style", "display: block");
                        document.getElementById("rowView").setAttribute("style", "display: none");                        
                    }}
                    >
                    <CircularIcon />
                </IconButton>
            </div>
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
                    var element = document.getElementById("uploadFileInput");
                    element.click();
                    element.addEventListener("change", handleFiles, false);
                    function handleFiles() {
                        let file = this.files[0];
                         signals.clickLoadFile({inputFile: file});
                    }
                }} />

                <input type="file" id="uploadFileInput" style={{display:'none'}} onChange={function() {
                }} />
            </div>
        );

        var fileButtonElement = (
            <IconButton tooltip="File">
                <FileIcon />
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

                    { toggleFeatures }

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
                        { fileMenuItems }
                    </IconMenu>
                    <IconButton
                        label="Gel Digest dialog"
                        tooltip='Simulate digestion'
                        onTouchTap={function() {
                            signals.gelDigestDisplay();
                        }}
                    >
                        <GelIcon />
                    </IconButton>
                    <IconButton
                        label="Dialog"
                        tooltip='Manage Restriction Enzymes'
                        onTouchTap={function() {
                            signals.restrictionEnzymeManagerDisplay();
                        }}
                        >
                        <EnzymesIcon />
                    </IconButton>
                    {gelModal}
                    {dialog}

                </ToolbarGroup>

            </Toolbar>
        );
    }
}