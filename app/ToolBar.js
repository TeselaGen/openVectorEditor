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
import downloadIcon from 'material-ui/lib/svg-icons/file/file-download';
import uploadIcon from 'material-ui/lib/svg-icons/file/file-upload';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TextField from 'material-ui/lib/text-field';

@Cerebral({
    showOrfs: ['showOrfs'],
    showCutsites: ['showCutsites'],
    showParts: ['showParts'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showSidebar: ['showSidebar']
})
@propTypes({
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
            </div>
        );

        var fileButtonElement = (
            <IconButton tooltip="File">
                <FileIcon />
            </IconButton>
        );

        var toggleMenuItems = annotationList.map(function(annotationType, index){
            return (
                <MenuItem key={index} primaryText={annotationType.label} insetChildren={true} checked={annotationType.state} onClick={function () {
                    signals.toggleAnnotationDisplay({type: String(annotationType.type)});
                }} />
            );
        });

        var iconButtonElement = (
            <IconButton tooltip="Settings">
                <SettingsIcon />
            </IconButton>
        );

        return (
            <Toolbar>
                <ToolbarGroup key={0}>
                  <RaisedButton
                     label='Features'
                     onTouchTap={function() {
                         signals.toggleAnnotationTable({ annotationType: 'features' });
                     }}
                     />
                  <RaisedButton
                     label='Cutsites'
                     onTouchTap={function() {
                         signals.toggleAnnotationTable({ annotationType: 'cutsites' });
                     }}
                     />
                  <RaisedButton
                     label='ORFs'
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
