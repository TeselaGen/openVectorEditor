import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import FlatButton from 'material-ui/lib/flat-button';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import LeftTile from './EnzymesGroups';
import RightTile from './ActiveEnzymes';

const Dialog = require('material-ui/lib/dialog');

@Cerebral({
    showRestrictionEnzymeManager: ['showRestrictionEnzymeManager'],
    originalUserEnzymesList: ['originalUserEnzymesList'],
    currentUserEnzymesList: ['currentUserEnzymesList']
})

export default class RestrictionEnzymeManager extends  React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        open: false,
    };

    render () {
        var {
            signals,
            showRestrictionEnzymeManager,
            originalUserEnzymesList,
            currentUserEnzymesList
        } = this.props;

        var tileTitleStyle = {
            textAlign: "center",
            color: "black",
        };

        var tileLeft = (
            <div>
                <LeftTile />
            </div>
        );

        var tileRight = (
            <div>
                <RightTile />
            </div>
        );

        var rightTileTitle = (
            <h4 style={tileTitleStyle}>Active enzymes</h4>
        );

        var grid = (
            <div>
                <GridList
                    cols={2}
                    cellHeight={400}
                    padding={10}
                    >
                    <GridTile
                        rows={1}
                        cols={1}
                        >
                        {tileLeft}
                    </GridTile>
                    <GridTile
                        rows={1}
                        cols={1}
                        title={rightTileTitle}
                        titlePosition={"top"}
                        titleBackground="#E0E0E0"
                        >
                        {tileRight}
                    </GridTile>
                </GridList>
            </div>
        );

        var toOpen = showRestrictionEnzymeManager;

        var actionButtons = [
            <FlatButton
                key="cancel"
                label={"Cancel"}
                onTouchTap={function() {
                        signals.updateUserEnzymes({
                            selectedButton: "Cancel",
                            currentUserList: currentUserEnzymesList,
                            originalUserList: originalUserEnzymesList
                        });
                        signals.restrictionEnzymeManagerDisplay();
                    }}
                />,
            <FlatButton
                key="apply"
                label={"Apply"}
                style={{color: "#03A9F4"}}
                onTouchTap={function() {
                        signals.updateUserEnzymes({
                            selectedButton: "Apply",
                            currentUserList: currentUserEnzymesList,
                            originalUserList: originalUserEnzymesList
                        });
                        signals.restrictionEnzymeManagerDisplay();
                    }}
                />,
        ];

        return (
            <div align="center">
                <Dialog
                    bodyStyle={{padding:'25px 25px 0 25px'}}
                    ref="enzymeManager"
                    title="Restriction Enzyme Manager"
                    autoDetectWindowHeight={true}
                    actions={actionButtons}
                    open={toOpen}
                    titleStyle={{padding:'25px 0 0 50px', color:"black", background:"white"}}
                    >
                    {grid}
                </Dialog>
            </div>
        );
    }
}
