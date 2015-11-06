// React
import React, { PropTypes } from 'react';
import { propTypes } from './react-props-decorators.js';

// Cerebral
import { Decorator as Cerebral } from 'cerebral-react';

// Material UI
import { Toolbar, ToolbarGroup } from 'material-ui';
import { IconMenu } from 'material-ui';
import { IconButton } from 'material-ui';
import SettingsIcon from 'material-ui/lib/svg-icons/action/settings';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { FlatButton } from 'material-ui';

@Cerebral({
    showOrfs: ['showOrfs'],
    showCutsites: ['showCutsites'],
    showParts: ['showParts'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations']
})
@propTypes({
    showOrfs: PropTypes.bool.isRequired,
    showCutsites: PropTypes.bool.isRequired,
    showParts: PropTypes.bool.isRequired,
    showFeatures: PropTypes.bool.isRequired,
    showTranslations: PropTypes.bool.isRequired
})
export default class ToolBar extends React.Component {

    constructor() {
        super(arguments);
        this.state = { overlayMenu: false, sideMenu: false };
    }

    render() {
        var {
            showFeatures,
            showParts,
            showTranslations,
            showOrfs,
            showCutsites,
            signals: {
                toggleAnnotationDisplay,
                showSideMenu
            }
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

        var that = this;
        var toggleState = function (key) {
            var state = that.state[key];
            var obj = {};
            obj[key] = !state;
            that.setState(obj);
        };

        var toggleMenuItems = annotationList.map(function(annotationType, index){
            return (
                <MenuItem key={index} primaryText={annotationType.label} insetChildren={true} checked={annotationType.state} onClick={function () {
                    toggleAnnotationDisplay(String(annotationType.type));
                }} />
            );
        });

        var iconButtonElement = (
            <IconButton tooltip="Settings">
                <SettingsIcon />
            </IconButton>
        );

        return (
            <div>
                <Toolbar>
                    <ToolbarGroup key={0}>
                        <FlatButton label="Click for Overlay Menu" onClick={function() { toggleState('overlayMenu'); }}/>
                        <FlatButton label="Click for Side Menu" onClick={function() { showSideMenu() }}/>
                    </ToolbarGroup>

                    <ToolbarGroup key={1}>
                        <IconMenu iconButtonElement={iconButtonElement} openDirection="bottom-right">
                            {toggleMenuItems}
                        </IconMenu>
                    </ToolbarGroup>
                </Toolbar>

                { this.state.overlayMenu && <div style={{
                    zIndex: '9999',
                    background: 'white',
                    border: '2px solid black',
                    position: 'absolute',
                    width: '250px',
                    height: '250px',
                    padding: '20px',
                    fontSize: '24px',
                    fontFamily: 'sans'
                }}>
                    This could be occluding something we want to highlight with this menu…
                </div>}

            </div>
        );
    }

}
