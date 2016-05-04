// React
import React, { PropTypes } from 'react';
import { propTypes } from './react-props-decorators.js';

// Cerebral
import { Decorator as Cerebral } from 'cerebral-view-react';

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
@propTypes({
    embedded: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool.isRequired,
    showOrfs: PropTypes.bool.isRequired,
    showCutsites: PropTypes.bool.isRequired,
    showParts: PropTypes.bool.isRequired,
    showFeatures: PropTypes.bool.isRequired,
    showTranslations: PropTypes.bool.isRequired
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

        // show/hide views buttons that only appear in embedded mode
        var embeddedControls = (
            embedded ? 
                <div>
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
            var stylePage = "<style>@page{margin: 1in;} #circularView,#rowView{width: 8.5in; display: block;} #circularView{page-break-after: always;} #rowView>div{bottom: auto;}</style>";
            var printTab = window.open();
            printTab.document.body.innerHTML = head + stylePage + contents;
            printTab.document.close();
            printTab.focus();
            printTab.print();
            printTab.close();
        }

        return (
            <Toolbar>
                <ToolbarGroup key={0}>
                    
                    {embeddedControls}

                    <IconButton
                        label='Feature Details'
                        onTouchTap={function() {
                            signals.toggleAnnotationTable({ annotationType: 'features' });
                        }}
                        >
                        <InputIcon />
                    </IconButton>
                    <IconButton
                        label='Print Current View'
                        onTouchTap={function() {
                            prepPrintPage();
                        }}
                    >
                        <PrintIcon />
                    </IconButton>                     
                    <IconButton
                        label='Search Sequence'
                        >
                        <SearchIcon />
                    </IconButton>

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
                </ToolbarGroup>
            </Toolbar>
        );
    }

}
