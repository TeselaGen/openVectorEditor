// React
import React, { PropTypes } from 'react';
import { propTypes } from './react-props-decorators.js';

// Cerebral
import { Decorator as Cerebral } from 'cerebral-view-react';

// Material UI
import { Toolbar, ToolbarGroup } from 'material-ui';
import { IconMenu } from 'material-ui';
import { IconButton } from 'material-ui';
import { RaisedButton } from 'material-ui'
import SettingsIcon from 'material-ui/lib/svg-icons/action/settings';
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
                         signals.toggleAnnotationTable({ currentSidebar: 'features' });
                     }}
                     />
                  <RaisedButton
                     label='Cutsites'
                     onTouchTap={function() {
                         signals.toggleAnnotationTable({ currentSidebar: 'cutsites' });
                     }}
                     />
                  <RaisedButton
                     label='ORFs'
                     onTouchTap={function() {
                         signals.toggleAnnotationTable({ currentSidebar: 'orfs' });
                     }}
                     />
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
