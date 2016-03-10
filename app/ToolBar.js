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
<<<<<<< HEAD
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
=======
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
>>>>>>> b869baf85582943bd1d64f8840e54bec3e7a61ea
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