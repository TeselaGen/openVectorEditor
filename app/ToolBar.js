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
import SettingsIcon from 'material-ui/lib/svg-icons/action/settings';
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

        var annotationList = [
            {
                type: 'features',
                label: 'Features',
                state: showFeatures
            },

            {
                type: 'parts',
                label: 'Parts',
                state: showParts
            },

            {
                type: 'translations',
                label: 'Translations',
                state: showTranslations
            },

            {
                type: 'orfs',
                label: 'ORFs',
                state: showOrfs
            },

            {
                type: 'cutsites',
                label: 'Cutsites',
                state: showCutsites
            }
        ];

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

        // pop out sidebar
        var toggleMenuItems = annotationList.map(function(annotationType, index){
            return (
                <MenuItem key={index} primaryText={annotationType.label} insetChildren={true} checked={annotationType.state} onClick={function () {
                    signals.toggleAnnotationDisplay({type: String(annotationType.type)});
                }} />
            );
        });

        // show/hide annotations
        var iconButtonElement = (
            <IconButton tooltip="Settings">
                <SettingsIcon />
            </IconButton>
        );

        // pulls out the current view and necessary resizing js to a new tab 
        // and applies some styling to cleanup for print version
        var prepPrintPage = function() {
            var contents = document.getElementById("allViews").innerHTML;
            var head = document.head.innerHTML;
            var stylePage = "<style>@page{margin: 1in;}</style>";
            var printTab = window.open();
            printTab.document.body.innerHTML = head + stylePage + contents;
            printTab.document.getElementById("allViews").attribute("style", "width: 8.5in; text-align: center;");
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
                        disabled={ readOnly }  // you can't save in read only
                        label='Save to Server'
                        onTouchTap={function() {
                            signals.saveChanges();
                        }}
                    >
                        <SaveIcon />
                    </IconButton>
                    <IconButton
                        label='Print Current View'
                        onTouchTap={function() {
                            prepPrintPage();
                        }}
                    >
                        <PrintIcon />
                    </IconButton>                    
                    <RaisedButton
                        label='F'
                        onTouchTap={function() {
                            signals.toggleAnnotationTable({ annotationType: 'features' });
                        }}
                    />
                    <RaisedButton
                        label='C'
                        onTouchTap={function() {
                            signals.toggleAnnotationTable({ annotationType: 'cutsites' });
                        }}
                    />
                    <RaisedButton
                        label='O'
                        onTouchTap={function() {
                            signals.toggleAnnotationTable({ annotationType: 'orfs' });
                        }}
                    />
                    <IconMenu iconButtonElement={fileButtonElement} openDirection="bottom-right">
                        {fileMenuItems}
                    </IconMenu>                  
                    <IconMenu iconButtonElement={iconButtonElement} openDirection="bottom-right">
                        {toggleMenuItems}
                    </IconMenu>
                    <TextField ref="searchField" hintText="search" />
                    <RaisedButton label='Search' onClick={this.search.bind(this)}/>
                    <RaisedButton label='Clear Search' onClick={this.clearSearch.bind(this)}/>
                </ToolbarGroup>
            </Toolbar>
        );
    }

}
